import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

import Button from "@material-ui/core/Button";
import ColorizeIcon from "@material-ui/icons/Colorize";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import ExchangeArea from './ExchangeArea'
import PartyList from './PartyList'
import MissionAwards from './MissionAwards'
import MissionBasicInfo from './MissionBasicInfo';

import Loading from 'components/layout/Loading';
import {itemsPath} from 'utils/definitions'
import { PintoTypography} from 'utils/fonts'

import { authCheck } from "store/actions/authActions";
import {togglePresenceInInstance, toggleUserReady, finishInstance, setActiveInstance} from 'store/actions/missionActions'
import {socket, modifyUserStatusSubscribe, finishMissionSubscribe} from 'socket'


const StyledItemIcon = styled.img`
  margin: 0 0.1rem 0 0;
  height: 1rem;
  width: 1rem;
`
const StyledItemsIndicator = styled.span`
  font-size: 10px;
  color: ${(props) => { 
      const green = props.inBox === props.required
      const red = props.inBox > props.required
      if(red){
        return('red')
      }else if(green){
        return ('green')
      }else{
        return('black')
      }}
    };
    margin-right: 0.5rem;
`

const MissionBar = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  margin: 0 0rem 0rem 0rem;
`


const ButtonBar = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  text-align: left;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0rem 1rem 0rem;
`

// const createTempMission = () => {
//     return {
//         id: 2,
//         title: 'Mission2',
//         avatarSrc: 'mission.png',
//         minPlayers: 3,
//         maxPlayers: 3,
//         description: 'Super important mission. You need have things and attributes, as always loool xd',
//         amulets: [
//             {
//                 quantity: 2,
//                 itemModel: {
//                     _id: 103,
//                     type: {
//                         _id: 201,
//                         type: 'amulet'
//                     },
//                     name: 'sapphire',
//                     imgSrc: 'sapphire-amulet.png'
//                 }
//             },
//             {
//                 quantity: 1,
//                 itemModel: {
//                     _id: 101,
//                     type: {
//                         _id: 201,
//                         type: 'amulet'
//                     },
//                     name: 'diamond',
//                     imgSrc: 'diamond-amulet.png'
//                 }
//             },
//             {
//                 quantity: 2,
//                 itemModel: {
//                     _id: 102,
//                     type: {
//                         _id: 201,
//                         type: 'amulet'
//                     },
//                     name: 'pearl',
//                     imgSrc: 'pearl-amulet.png'
//                 }
//             },
//         ]
//     }
// }

class MissionInstance extends React.Component {
    

    state = {
        instanceItems: [],
        instanceUsers: [],
        loading: true,
        missionId: null,
        missionObject: null,
        leader: null,
        fullHeightCorrection: 0,
        showAwards: false
    }


    

    handleBack = async (withStack) => {
        
        try{
            const thisUser = this.instanceUsers.find((user) => user.profile._id === this.props.uid)
            if(thisUser.inMission){
                const user = {_id: this.props.uid, inMission: false, readyStatus: false}
                await togglePresenceInInstance(user, this.props.party._id)
            }
        }catch(e){}

        if(withStack){
            this.pushToEvents(this.props.history)
        }else{
            this.backToEvents(this.props.history);
        }
    }

    backToEvents = (history) => {
        history.replace({
          pathname: '/',
          state: {indexRedirect: 2, authCheck: true}
        }) 
    }

    pushToEvents = history => {
        
        history.push({
          pathname: "/",
          state: { indexRedirect: 2, authCheck: true}
        });
    }

    

    async componentDidMount() {

        

        if(!this.props.location.state || (this.props.location.state.id === undefined)){
            this.handleBack()
            return
        }

        const socketConnectionStatus = socket.connected

        try{
            const user = {_id: this.props.uid, inMission: true}
            console.log(this.props)
            const response = await togglePresenceInInstance(user, this.props.party._id,  socketConnectionStatus)
            
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
                loading: false,
                
            }, () => {
                const navbar = document.getElementById("navbar").offsetHeight;
                const footer = document.getElementById("footer").offsetHeight;

                this.setState({
                    fullHeightCorrection: navbar+footer,
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
        }catch(e){
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


        if(modifyUserArrayIndex < 0){
            console.log(users)
            console.log(user)
        }

        //console.log(modifyUserArrayIndex)
        if(user.hasOwnProperty('readyStatus')){
            users[modifyUserArrayIndex].readyStatus = user.readyStatus;
        }
        if(user.hasOwnProperty('inMission')){
            users[modifyUserArrayIndex].inMission = user.inMission;
        }
    
    
        return users
    }

    componentDidUpdate = (prevProps, prevState) => {
        //USEFUL COMPONENT UPDATE DIAGNOSTICS
        Object.entries(this.props).forEach(
            ([key, val]) =>
            prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
            Object.entries(this.state).forEach(
            ([key, val]) =>
                prevState[key] !== val && console.log(`State '${key}' changed`)
            );
        }
        if((!prevProps.party.hasOwnProperty('leader') && this.props.party.hasOwnProperty('leader')) && !socket.connected){
            this.handleBack()
        }
    }
    


    updateInstanceItems = (items) => {
        
        this.setState({
            instanceItems: items
        })
    }

   

    handleReadyButton = async () => {
        if(this.state.leader) {
            try{
                const user = {_id: this.props.uid, readyStatus: !this.state.userReadyStatus}
                await toggleUserReady(user, this.props.party._id)
                const awards = await this.props.finishInstance()
                console.log(awards)
                this.setState({ 
                    missionAwards: awards
                }, () => {
                    this.setState({ 
                        showAwards: true,
                    })
                });
            }catch(e){
                //console.log(e)
                this.handleBack()
            }   
        }else{
            
            try{
                const user = {_id: this.props.uid, readyStatus: !this.state.userReadyStatus}
                await toggleUserReady(user, this.props.party._id)

                const instanceUsers = this.modifyUserStatus(user, this.state.instanceUsers)
                this.setState({
                    instanceUsers,
                    userReadyStatus: !this.state.userReadyStatus
                })
            }catch(e){
                this.handleBack()
            } 
        }
        
    };

    checkItemsCondition = () => {

        const amulets = this.state.missionObject.amulets 

        let overallReadyStatus = true
        for(let index = 0; index < amulets.length; index++) {
            const specificAmuletInstances = this.state.instanceItems.filter((item) => {
                return item.itemModel._id === amulets[index].itemModel._id
            })

            //console.log(amulets[index].itemModel.name, amulets[index].quantity)
            //console.log(specificAmuletInstances)

            amulets[index].inBox = specificAmuletInstances.length

            if(specificAmuletInstances.length !== amulets[index].quantity){
                overallReadyStatus = false
                amulets[index].readyStatus = false
            }else{
                amulets[index].readyStatus = true
            }
        }

        if(!overallReadyStatus){
            return false
        }

        return true
    }

    checkPartyCondition = () => {

        //console.log(this.state.instanceUsers)
        let partyCondition = true
        this.state.instanceUsers.forEach((member) => {
            if((member.profile._id !== this.props.uid) && !member.readyStatus){
                partyCondition = false
            }
        })
        
        return partyCondition
    }




    render(){
        if(this.state.loading){
            return <Loading />
        }
        
        const requiredMissionItems = this.state.missionObject.amulets

        const buttonReadyLabel = this.state.leader ? (`Wyrusz`) : (`Gotów`)

        const statusIcon = (condition) => condition ? (
            <CheckIcon
                style={{
                    flexBasis: '10%',
                    color: "green",
                    fontSize: "2rem",
                    transition: "transform 500ms ease-out",
                    
                }}
            />
        ) : (
            <ClearIcon
                style={{
                    flexBasis: '10%',
                    color: "red",
                    fontSize: "2rem",
                    transition: "transform 500ms ease-out",
                    
                }}
            />
        )


        
        const isRequiredItemsCollected = this.checkItemsCondition()
        const isAllPartyReady = this.state.leader ? this.checkPartyCondition() : true
        //console.log(isAllPartyReady)

        const mission = this.state.missionObject
        return(
            <div style={{display: 'flex', flexDirection: 'column', padding: `0rem 2rem`, alignItems: 'center', minHeight:`calc(100vh - (${this.state.fullHeightCorrection}px)`}}>
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
                     <Grid
                        container
                        direction="column"
                        style={{ padding: "1rem 0 1.5rem 0", textAlign: "left" }}
                    >
                        <MissionBasicInfo mission={mission}/>
                    </Grid>
                    
                    <Grid
                        container
                        direction="row"
                        style={{ textAlign: "left" }}
                    >
                        <Grid item xs={3}>

                        </Grid>
                        <Grid item xs={9}>
                            <MissionBar>
                            
                            {requiredMissionItems.map((amulet) => {
                                return (
                                    <React.Fragment key={amulet.itemModel._id}>
                                        
                                        <StyledItemIcon src={`${itemsPath}${amulet.itemModel.imgSrc}`}/>
                                        <StyledItemsIndicator required={amulet.quantity} inBox={amulet.inBox}><Typography style={{fontSize: '0.8rem'}}>{` ${amulet.inBox}/${amulet.quantity}`}</Typography></StyledItemsIndicator>
                                        {/* {statusIcon(amulet.readyStatus)} */}
                                    </React.Fragment>
                                )
                            })}
                        
                            </MissionBar>
                        </Grid>
                    </Grid>
                   
                    
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
                        
                    
                    <ButtonBar>
                        <Button 
                            style={{
                                display: 'flex',
                                flexFlow: 'row nowrap',
                                margin: '1rem 2rem',
                                width: 'calc(100% - 4rem)',
                                position: 'absolute',
                                bottom: document.getElementById("footer").offsetHeight,
                                left: 0,
                                borderRadius: 0,
                            }} 
                            onClick={this.handleReadyButton} 
                            disabled={this.state.leader && (!isRequiredItemsCollected || !isAllPartyReady)} 
                            variant="contained" 
                            color="primary"
                        >
                            <PintoTypography style={{flexBasis: '80%'}}>{buttonReadyLabel}</PintoTypography>
                            <ColorizeIcon
                                style={{
                                    flexBasis: '10%',
                                    margin: '0 0 0 0.2rem',
                                    fontSize: "2rem",
                                    transition: "transform 500ms ease-out",
                                    transform: this.state.userReadyStatus ? "rotate(540deg)" : "rotate(0deg)"
                                    
                                }}
                            />
                            {!this.state.leader ? statusIcon(this.state.userReadyStatus) : statusIcon(isRequiredItemsCollected && isAllPartyReady)}
                        </Button>
                    </ButtonBar>
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
