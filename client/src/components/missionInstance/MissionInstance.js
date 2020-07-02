import React from 'react'
import { connect } from 'react-redux'

import MissionInfo from './MissionInfo';
import AmuletsBar from './AmuletsBar';
import ExchangeArea from './ExchangeArea'
import PartyList from './PartyList'
import ButtonBar from './ButtonBar'
import MissionAwards from './MissionAwards'



import Loading from 'components/layout/Loading';


import { authCheck } from "store/actions/authActions";
import { togglePresenceInInstance, toggleUserReady, finishInstance, setActiveInstance } from 'store/actions/missionActions'
import { socket, modifyUserStatusSubscribe, finishMissionSubscribe } from 'socket'


class MissionInstance extends React.Component {

    state = {
        instanceItems: [],
        instanceUsers: [],
        loaded: false,
        missionId: null,
        missionObject: null,
        leader: null,
        userReadyStatus: false,
        fullHeightCorrection: 0,
        showAwards: false
    }


    handleBack = async (withStack) => {

        try {
            const thisUser = this.instanceUsers.find((user) => user.profile._id === this.props.uid)
            if (thisUser.inMission) {
                const user = { _id: this.props.uid, inMission: false, readyStatus: false }
                await togglePresenceInInstance(user, this.props.party._id)
            }
        } catch (e) { }

        if (withStack) {
            this.pushToEvents(this.props.history)
        } else {
            this.backToEvents(this.props.history);
        }
    }

    backToEvents = (history) => {
        history.replace({
            pathname: '/',
            state: { indexRedirect: 2, authCheck: true }
        })
    }

    pushToEvents = history => {

        history.push({
            pathname: "/",
            state: { indexRedirect: 2, authCheck: true }
        });
    }



    async componentDidMount() {



        if (!this.props.location.state || (this.props.location.state.id === undefined)) {
            this.handleBack()
            return
        }

        const socketConnectionStatus = socket.connected

        try {
            const user = { _id: this.props.uid, inMission: true }

            const response = await togglePresenceInInstance(user, this.props.party._id, socketConnectionStatus)

            const missionInstance = response.missionInstance
            const amulets = response.amulets

            const instanceUsers = this.modifyUserStatus(user, missionInstance.party)
            const leader = !this.props.party.leader || (this.props.party.leader._id === this.props.uid)

            this.setState({
                instanceUsers: [...instanceUsers],
                instanceItems: [...missionInstance.items],
                userItems: [...amulets],
                missionObject: missionInstance.mission,
                leader: leader,
                loaded: true,

            }, () => {
                const navbar = document.getElementById("navbar") ? document.getElementById("navbar").offsetHeight : 0;
                const footer = document.getElementById("footer") ? document.getElementById("footer").offsetHeight : 0;

                this.setState({
                    fullHeightCorrection: navbar + footer,
                })

                modifyUserStatusSubscribe((user) => {

                    const instanceUsers = this.modifyUserStatus(user, this.state.instanceUsers)

                    this.setState({
                        instanceUsers
                    })
                })

                finishMissionSubscribe((awards) => {
                    //console.log('finishMission sub')
                    this.props.setActiveInstance(null, null)
                    this.setState({
                        missionAwards: awards
                    }, () => {
                        this.setState({
                            showAwards: true,
                        })
                    });
                })
            })
        } catch (e) {
            console.log(e)
            this.handleBack()
        }

    }

    modifyUserStatus = (user, users) => {
        //console.log(user)

        //console.log(users)
        const modifyUserArrayIndex = users.findIndex(
            specificUser => {
                //console.log(specificUser.profile._id, user._id)
                return specificUser.profile._id === user._id;
            }
        );


        if (modifyUserArrayIndex < 0) {
            console.log(users)
            console.log(user)
        }

        //console.log(modifyUserArrayIndex)
        if (user.hasOwnProperty('readyStatus')) {
            users[modifyUserArrayIndex].readyStatus = user.readyStatus;
        }
        if (user.hasOwnProperty('inMission')) {
            users[modifyUserArrayIndex].inMission = user.inMission;
        }


        return users
    }

    componentDidUpdate = (prevProps, prevState) => {
        if ((!prevProps.party.hasOwnProperty('leader') && this.props.party.hasOwnProperty('leader')) && !socket.connected) {
            this.handleBack()
        }
    }



    updateInstanceItems = (items) => {

        this.setState({
            instanceItems: items
        })
    }



    handleReadyButton = async () => {
        try {
            const user = { _id: this.props.uid, readyStatus: !this.state.userReadyStatus }
            await toggleUserReady(user, this.props.party._id)

            if (this.state.leader) {
                const awards = await this.props.finishInstance()
                this.setState({
                    missionAwards: awards
                }, () => {
                    this.setState({
                        showAwards: true,
                    })
                });
            } else {
                const instanceUsers = this.modifyUserStatus(user, this.state.instanceUsers)
                this.setState({
                    instanceUsers,
                    userReadyStatus: !this.state.userReadyStatus
                })
            }

        } catch (e) {
            //console.log(e)
            this.handleBack()
        }
    };

    setStatusesAndCheckItemsCondition = () => {

        const amulets = [...this.state.missionObject.amulets]

        let overallReadyStatus = true
        for (let index = 0; index < amulets.length; index++) {
            const specificAmuletInstances = this.state.instanceItems.filter((item) => {
                return item.itemModel._id === amulets[index].itemModel._id
            })

            //console.log(amulets[index].itemModel.name, amulets[index].quantity)
            //console.log(specificAmuletInstances)

            amulets[index].inBox = specificAmuletInstances.length

            if (specificAmuletInstances.length !== amulets[index].quantity) {
                overallReadyStatus = false
                amulets[index].readyStatus = false
            } else {
                amulets[index].readyStatus = true
            }
        }



        if (!overallReadyStatus) {
            return { isRequiredItemsCollected: false, amulets }
        }

        return { isRequiredItemsCollected: true, amulets }


    }

    checkPartyCondition = () => {

        //console.log(this.state.instanceUsers)
        let partyCondition = true
        this.state.instanceUsers.forEach((member) => {
            if ((member.profile._id !== this.props.uid) && !member.readyStatus) {
                partyCondition = false
            }
        })

        return partyCondition
    }




    render() {
        if (!this.state.loaded) {
            return <Loading />
        }

        const { isRequiredItemsCollected, amulets } = this.setStatusesAndCheckItemsCondition()
        const isAllPartyReady = this.state.leader ? this.checkPartyCondition() : true


        return (
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: `0rem 2rem`,
                    alignItems: 'center',
                    minHeight: `calc(100vh - (${this.state.fullHeightCorrection}px)`
                }}
                role='application'
            >
                {this.state.showAwards ? (
                    <MissionAwards
                        missionExperience={this.state.missionObject.experience}
                        missionAwards={this.state.missionAwards}
                        userPerks={this.props.profile.userPerks}
                        userClass={this.props.profile.class}
                        authCheck={() => this.props.authCheck()}
                        fullHeightCorrection={this.state.fullHeightCorrection}

                    />
                ) : (
                        <React.Fragment >
                            <MissionInfo
                                mission={this.state.missionObject}
                            />
                            <AmuletsBar
                                amulets={amulets}
                            />
                            <ExchangeArea
                                userId={this.props.uid}
                                avatar={this.props.profile.avatar}
                                userName={this.props.profile.name}
                                locationId={this.props.party._id}
                                instanceItems={this.updateInstanceItems}
                                initUserItems={this.state.userItems}
                                initMissionItems={this.state.instanceItems}
                                userReadyStatus={this.state.userReadyStatus}
                                handleBack={this.handleBack}
                            />
                            <PartyList
                                userId={this.props.uid}
                                instanceUsers={this.state.instanceUsers}
                                instanceItems={this.state.instanceItems}
                                party={this.props.party}
                                userReadyStatus={this.state.userReadyStatus}
                            />
                            <ButtonBar
                                leader={this.state.leader}
                                handleReadyButton={this.handleReadyButton}
                                isRequiredItemsCollected={isRequiredItemsCollected}
                                isAllPartyReady={isAllPartyReady}
                                isUserReady={this.state.userReadyStatus}
                            />
                        </React.Fragment>
                    )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        profile: state.auth.profile,
        party: state.party
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authCheck: () => dispatch(authCheck()),
        finishInstance: (partyId) => dispatch(finishInstance(partyId)),
        setActiveInstance: (id, imgSrc) => dispatch(setActiveInstance(id, imgSrc))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionInstance)