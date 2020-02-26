import React from 'react'
import {connect} from 'react-redux'
import ExchangeArea from './mission/ExchangeArea'
import PartyList from './mission/PartyList'
import Loading from '../../layout/Loading';
import MissionBasicInfo from './mission/MissionBasicInfo';
import styled from 'styled-components'
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ColorizeIcon from "@material-ui/icons/Colorize";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import VerificationPage from './mission/VerificationPage'
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Grid from "@material-ui/core/Grid";

import {itemsPath, missionsPath} from '../../../utils/definitions'
import { PintoTypography} from '../../../utils/fonts'

import { authCheck } from "../../../store/actions/authActions";
import {togglePresenceInInstance, toggleUserReady, finishInstance} from '../../../store/actions/missionActions'
import {socket, modifyUserStatusSubscribe, finishMissionSubscribe} from '../../../socket'

const ShortDescription = styled(PintoTypography)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  height: 60;
  overflow: hidden;
  white-space: hidden;
  text-overflow: ellipsis;
`;

const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem 1.5rem 1rem 1.5rem;
`

const StyledImg = styled.img`
  margin: 0 0.5rem 0 0;
  height: 32px;
  width: 32px;
`

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
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  margin: 0 0rem 0rem 0rem;
`


const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem 0rem 0.5rem 0rem;
`

const createTempMission = () => {
    return {
        id: 2,
        title: 'Mission2',
        avatarSrc: 'mission.png',
        minPlayers: 3,
        maxPlayers: 3,
        description: 'Super important mission. You need have things and attributes, as always loool xd',
        amulets: [
            {
                quantity: 2,
                itemModel: {
                    _id: 103,
                    type: {
                        _id: 201,
                        type: 'amulet'
                    },
                    name: 'sapphire',
                    imgSrc: 'sapphire-amulet.png'
                }
            },
            {
                quantity: 1,
                itemModel: {
                    _id: 101,
                    type: {
                        _id: 201,
                        type: 'amulet'
                    },
                    name: 'diamond',
                    imgSrc: 'diamond-amulet.png'
                }
            },
            {
                quantity: 2,
                itemModel: {
                    _id: 102,
                    type: {
                        _id: 201,
                        type: 'amulet'
                    },
                    name: 'pearl',
                    imgSrc: 'pearl-amulet.png'
                }
            },
        ]
    }
}

class MissionInstance extends React.Component {
    

    state = {
        instanceItems: [],
        instanceUsers: [],
        loading: true,
        missionId: null,
        missionObject: null,
        leader: null,
    }

    async componentWillUnmount() {
        const user = {_id: this.props.auth.uid, inMission: false, readyStatus: false}
        await togglePresenceInInstance(user, this.props.party._id)
        await this.props.authCheck()
    }

    backToEvents = (history) => {
        history.push({
          pathname: '/',
          state: {indexRedirect: 1}
        }) 
    }

    handleBack = () => {
        this.backToEvents(this.props.history)
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
        //console.log(modifyUserArrayIndex)
        if(user.hasOwnProperty('readyStatus')){
            users[modifyUserArrayIndex].readyStatus = user.readyStatus;
        }
        if(user.hasOwnProperty('inMission')){
            users[modifyUserArrayIndex].inMission = user.inMission;
        }
    
    
        return users
    }

    async componentDidMount() {

        if(!this.props.location.state || (this.props.location.state.id === undefined)){
            this.handleBack()
            return
        }

        const socketConnectedStatus = socket.connected

        const navbar = document.getElementById("navbar").offsetHeight;
        const footer = document.getElementById("footer").offsetHeight;
      

        try{
            const user = {_id: this.props.auth.uid, inMission: true}
            const leader = !this.props.party.leader || (this.props.party.leader._id === this.props.auth.uid)
            const response = await togglePresenceInInstance(user, this.props.party._id, socketConnectedStatus)
            const missionInstance = response.missionInstance
            const amulets = response.amulets
            //console.log(amulets)
            const instanceUsers = this.modifyUserStatus(user, missionInstance.party)
            //console.log(instanceUsers)
            this.setState({
                instanceUsers: [...instanceUsers],
                instanceItems: [...missionInstance.items],  
                userItems: [...amulets],
                missionObject: missionInstance.mission,//this.props.location.state.id,
                leader: leader,
                loading: false,
                fullHeightCorrection: navbar+footer,
            }, () => {
                modifyUserStatusSubscribe((user) => {
            
                    const instanceUsers = this.modifyUserStatus(user, this.state.instanceUsers)
                    
                    this.setState({
                        instanceUsers
                    })
                })

                finishMissionSubscribe((awards) => {
                    //console.log('finishMission sub')
                    this.setState({ 
                        missionAwards: awards
                    }, () => {
                        this.setState({ 
                            showVerificationPage: true,
                        })
                    });
                })
            })
        }catch(e){
            //console.log(e)
            this.handleBack()
        }

        
        
    
        
    }

    componentDidUpdate = (prevProps) => {
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
                const user = {_id: this.props.auth.uid, readyStatus: !this.state.userReadyStatus}
                await toggleUserReady(user, this.props.party._id)
                const awards = await finishInstance(this.props.party._id)
                this.setState({ 
                    missionAwards: awards
                }, () => {
                    this.setState({ 
                        showVerificationPage: true,
                    })
                });
            }catch(e){
                //console.log(e)
                this.handleBack()
            }   
        }else{
            const user = {_id: this.props.auth.uid, readyStatus: !this.state.userReadyStatus}
            try{
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
            if((member.profile._id !== this.props.auth.uid) && !member.readyStatus){
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
                    color: "green",
                    fontSize: "2rem",
                    transition: "transform 500ms ease-out",
                    
                }}
            />
        ) : (
            <ClearIcon
                style={{
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
            <div style={{display: 'flex', flexDirection: 'column', padding: "0.5rem 2rem", alignContent: 'center', fontFamily: '"Roboto", sans-serif', minHeight:`calc(100vh - ${this.state.fullHeightCorrection}px)`}}>
            {this.state.showVerificationPage ? (
                <VerificationPage 
                    missionExperience={this.state.missionObject.experience} 
                    missionAwards={this.state.missionAwards} 
                    userPerks={this.props.auth.profile.userPerks}
                    userClass={this.props.auth.profile.class} 
                    authCheck={() => this.props.authCheck()}
                />
            ) : (
                <React.Fragment>
                    
                    {/* <TitleBar>
                        <StyledImg src={`${missionsPath}${this.state.missionObject.imgSrc}`}/>
                        <Typography style={{display: 'inline'}} variant="h6">{this.state.missionObject.title}</Typography>
                        {statusIcon(isRequiredItemsCollected)}
                    </TitleBar>   
                     */}
                     <Grid
                        container
                        direction="column"
                        style={{ padding: "0.5rem 0 1.5rem 0", textAlign: "left" }}
                    >
                        {/* <Grid container direction="row">
                            <Grid item xs={9}>
                                <Grid container direction="column">
                                    <Grid
                                    item
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "0.5rem"
                                    }}
                                    >
                                    <Typography component="span" variant="h6" color="textPrimary">
                                        {mission.title}
                                    </Typography>
                                    {mission.unique && (
                                        <StarBorderIcon style={{ marginLeft: "1rem" }} />
                                    )}
                                    </Grid>
                                    <Grid item>
                                    <ShortDescription
                                        component="span"
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {mission.description}
                                    </ShortDescription>
                                    </Grid>
                                </Grid>
                            </Grid>
                                <Grid item xs={3}>
                                <Grid container direction="column">
                                    <Grid
                                    item
                                    style={{ display: "flex", justifyContent: "flex-end" }}
                                    >
                                    <Avatar
                                        alt="avatar"
                                        style={{ width: "5rem", height: "5rem", borderRadius: "0" }}
                                        variant="square"
                                        src={`${missionsPath}${mission.imgSrc}`}
                                    />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid> */}
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
                                    <React.Fragment key={amulet.itemModel.id}>
                                        
                                        <StyledItemIcon src={`${itemsPath}${amulet.itemModel.imgSrc}`}/>
                                        <StyledItemsIndicator required={amulet.quantity} inBox={amulet.inBox}><Typography style={{fontSize: '0.8rem'}}>{` ${amulet.inBox}/${amulet.quantity}`}</Typography></StyledItemsIndicator>
                                        {/* {statusIcon(amulet.readyStatus)} */}
                                    </React.Fragment>
                                )
                            })}
                        
                            </MissionBar>
                        </Grid>
                    </Grid>
                   
                    
                    <ExchangeArea userId={this.props.auth.uid} avatar={this.props.auth.profile.avatar} userName={this.props.auth.profile.name} locationId={this.props.party._id} instanceItems={this.updateInstanceItems} initUserItems={this.state.userItems} initMissionItems={this.state.instanceItems} userReadyStatus={this.state.userReadyStatus} handleBack={this.handleBack}/>
                    <PartyList userId={this.props.auth.uid} instanceUsers={this.state.instanceUsers} instanceItems={this.state.instanceItems} party={this.props.party} userReadyStatus={this.state.userReadyStatus} />
                        
                    
                        <ButtonBar>
                            <Button 
                                style={{width: '36%', marginRight: '0.5rem'}} 
                                onClick={this.handleBack} 
                                variant="contained" 
                                color="primary" >
                                    <KeyboardArrowLeftIcon
                                    style={{
                                        fontSize: "2rem",
                                        transition: "transform 500ms ease-out",
                                        transform: this.state.backButtonMouseOver ? "rotate(540deg)" : "rotate(0deg)"
                                    }}
                                />
                                Wyjdź
                                
                            </Button>
                            <Button style={{width: '52%'}} onClick={this.handleReadyButton} disabled={this.state.leader && (!isRequiredItemsCollected || !isAllPartyReady)} variant="contained" color="primary">
                                {buttonReadyLabel}
                                <ColorizeIcon
                                style={{
                                    margin: '0 0 0 0.2rem',
                                    fontSize: "2rem",
                                    transition: "transform 500ms ease-out",
                                    transform: this.state.userReadyStatus ? "rotate(540deg)" : "rotate(0deg)"
                                    
                                }}
                                />
                            </Button>
                            
                            {!this.state.leader ? statusIcon(this.state.userReadyStatus) : statusIcon(isRequiredItemsCollected && isAllPartyReady)}
                            
                            
                        </ButtonBar>
                </React.Fragment>
                )}
            </div>
        )
    }
  
    
    
}

const mapStateToProps = state => {
    return {
      auth: state.auth,
      party: state.party
    };
  };

const mapDispatchToProps = dispatch => {
    return {
        authCheck: () => {dispatch(authCheck())}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MissionInstance)
