import React from 'react'
import ExchangeArea from './mission/ExchangeArea'
import PartyList from './mission/PartyList'
import Loading from '../../layout/Loading';
import styled from 'styled-components'
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ColorizeIcon from "@material-ui/icons/Colorize";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import VerificationPage from './mission/VerificationPage'
import { Typography } from '@material-ui/core';
import {connect} from 'react-redux'
import {togglePresenceInInstance, toggleUserReady} from '../../../store/actions/missionInstanceActions'
import {registerUserSubscribe, unregisterUserSubscribe, modifyUserStatusSubscribe} from '../../../socket'

// const getRandomInt = (min, max) => {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
  
// const randomUserId = getRandomInt(1, 5)

const TitleBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 1rem 1.5rem 1rem 1.5rem;
`

const StyledImg = styled.img`
  margin: 0 0.5rem 0 0
  height: 32px;
  width: 32px;
`

const StyledItemIcon = styled.img`
  margin: 0 0.1rem 0 0.5rem
  height: 32px;
  width: 32px;
`
const StyledItemsIndicator = styled.span`
  font-size: 10px
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
    }
`

const MissionBar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 1.5rem 1rem 1.5rem;
`


const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  align-items: center;
  justify-content: space-between
  margin: 0.5rem 1.5rem 0.5rem 1.5rem;
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
        loading: true,
        roomId: null,
        missionId: null,
        missionObject: null,
        leader: randomUserId === 1,
    }

    componentWillUnmount() {
        const user = {_id: this.props.auth.uid, inMission: false}
        this.props.togglePresenceInInstance(user)
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

    async componentDidMount() {

        if(!this.props.location.state || (this.props.location.state.id === undefined)){
            this.handleBack()
        }


        registerUserSubscribe((user) => {

            const users = [...this.state.instanceUsers, user]
        
            this.setState({
                instanceUsers: users
            })
        })
    
        unregisterUserSubscribe(socket, (id) => {
    
            const users = this.state.instanceUsers.filter((user) => {
                return user._id !== id
            })
        
            this.setState({
                instanceUsers: users
            })
        })
    
        modifyUserStatusSubscribe(socket, (user) => {
        
            const users = [...this.state.instanceUsers];
        
            const modifyUserArrayIndex = users.findIndex(
                specificUser => {
                    return specificUser._id === user._id;
                }
            );
            if(user.hasOwnProperty('readyStatus')){
                users[modifyUserArrayIndex].readyStatus = user.readyStatus;
            }
            if(user.hasOwnProperty('inMission')){
                users[modifyUserArrayIndex].inMission = user.inMission;
            }
            
        
            this.setState({
                instanceUsers: users
            })
        })
        try{
            const user = {_id: this.props.auth.uid, inMission: true}
            const missionInstance = await this.props.togglePresenceInInstance(user)
            this.setState({
                instanceUsers: [...missionInstance.party],
                missionObject: missionInstance.mission,//this.props.location.state.id,
                loading: false
            })
        }catch{
            this.handleBack()
        }
        
        
        //api backend -> in response id missionInstance
        
    }
    
    
    

    handleConnection = (roomId) => {
        this.setState({
            roomId: roomId
        })
    }


    updateInstanceItems = (items) => {
        
        this.setState({
            instanceItems: items
        })
    }

    // updateInstanceUsers = (users) => {
        
    //     this.setState({
    //         instanceUsers: users
    //     })
    // }

    updatePartyCondition = (condition) => {
        this.setState({
            partyCondition: condition
        })
    }
   

    handleReadyButton = () => {
        if(this.state.leader) {
            this.setState({ showVerificationPage: true });
        }else{
            const user = {_id: this.props.auth.uid, readyStatus: !this.state.userReadyStatus}
            try{
                await this.props.toggleUserReady(user, this.props.party._id)
            }catch(e){
                this.handleBack()
            }
            

            this.setState({
                userReadyStatus: !this.state.userReadyStatus
            })
            
        }
        
    };

    checkItemsCondition = () => {

        const amulets = this.state.missionObject.amulets 

        let overallReadyStatus = true
        for(let index = 0; index < amulets.length; index++) {
            const specificAmuletInstances = this.state.instanceItems.filter((item) => {
                return item.model._id === amulets[index].itemModel._id
            })

            console.log(amulets[index].itemModel.name, amulets[index].quantity)
            console.log(specificAmuletInstances)

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
        return true//this.state.partyCondition
    }




    render(){
        if(this.state.loading){
            return <Loading />
        }

        const partySize = this.props.party.members.length + 1 //from backend by leader profile update
        const leader = this.props.party.leader === this.props.auth.uid //from backend by leader profile update
        
        const requiredMissionItems = this.state.missionObject.amulets

        const buttonReadyLabel = leader ? (`Wyrusz`) : (`Gotów`)

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
        const isAllPartyReady = this.checkPartyCondition()


        
        return(
            <div style={{fontFamily: '"Roboto", sans-serif'}}>
            {this.state.showVerificationPage ? (
                <VerificationPage />
            ) : (
                <div>
                <TitleBar>
                    <StyledImg src={require(`../../../assets/avatar/${this.state.missionObject.avatarSrc}`)}/>
                    <Typography style={{display: 'inline'}} variant="h6">{this.state.missionObject.name}</Typography>
                    {statusIcon(isRequiredItemsCollected)}
                </TitleBar>   
                <MissionBar>
                    
                    {requiredMissionItems.map((amulet) => {
                        return (
                            <React.Fragment key={amulet.itemModel.id}>
                                
                                <StyledItemIcon src={require(`../../../assets/icons/items/${amulet.itemModel.imgSrc}`)}/>
                                <StyledItemsIndicator required={amulet.quantity} inBox={amulet.inBox}>{` ${amulet.inBox}/${amulet.quantity}`}</StyledItemsIndicator>
                                {statusIcon(amulet.readyStatus)}
                            </React.Fragment>
                        )
                    })}
                
                </MissionBar>
                
                <ExchangeArea userId={this.props.auth.uid} locationId={this.props.party._id/*this.props.location.state.id*/} setConnection={this.handleConnection} instanceItems={this.updateInstanceItems} userReadyStatus={this.state.userReadyStatus}/>
                <PartyList userId={this.props.auth.uid} instanceUsers={this.state.instanceUsers} instanceItems={this.state.instanceItems} isUserLeader={this.state.leader} userReadyStatus={this.state.userReadyStatus} partyCondition={this.updatePartyCondition}/>
                    
                
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
                    
                    {statusIcon(this.state.userReadyStatus)}
                    
                    
                </ButtonBar>
                    <span style={{fontSize: 8}}>SocketIO-RoomId (temporary missionId): {this.state.roomId} ||| </span>
                    <span style={{fontSize: 8}}>RandomUserId (1-5, can be duplicated -> refresh): {randomUserId}</span>
                </div>
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

export default connect(mapStateToProps)(MissionInstance)
