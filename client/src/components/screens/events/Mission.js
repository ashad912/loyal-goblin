import React from 'react'
import ExchangeArea from './mission/ExchangeArea'
import PartyList from './mission/PartyList'
import Loading from '../../layout/Loading';
import styled from 'styled-components'
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ColorizeIcon from "@material-ui/icons/Colorize";

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
const randomUserId = getRandomInt(1, 5)

const MissionBar = styled.div`
  flex-grow: 1;
  flex-direction: row;
`

const StyledImg = styled.img`
  height: 20px;
  width: 20px;
`

const ButtonBar = styled.div`
  flex-grow: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
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

export default class Mission extends React.Component {
    

    state = {
        instanceItems: [],
        loading: true,
        roomConnected: false,
        missionId: null,
        missionObject: createTempMission(),
        leader: true,
    }
        

    componentDidMount() {

        if(!this.props.location.state || !this.props.location.state.id){
            this.backToEvents(this.props.history)
        }

        //api backend -> in response id missionInstance
        this.setState({
            missionId: this.props.location.state.id,
            loading: false
        },)
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

    handleConnection = () => {
        this.setState({
            roomConnected: true
        })
    }

    updateInstanceItems = (items) => {
        
        this.setState({
            instanceItems: items
        })
    }
   

    handleReadyButton = () => {
        console.log(this.state.instanceItems);
    };

    checkConditions = () => {

        if(!this.state.leader){
            return false
        }
        
        const amulets = this.state.missionObject.amulets 

        for(let index = 0; index < amulets.length; index++) {
            const specificAmuletInstances = this.state.instanceItems.filter((item) => {
                return item.model._id === amulets[index].itemModel._id
            })

            console.log(amulets[index].itemModel.name, amulets[index].quantity)
            console.log(specificAmuletInstances)

            if(specificAmuletInstances.length !== amulets[index].quantity){
                return true
            }
        }

        
        return false
    }

    render(){
        if(this.state.loading){
            return <Loading />
        }

        const partySize = 5 //from backend by leader profile update
        const leader = this.state.leader //from backend by leader profile update
        
        const requiredMissionItems = this.state.missionObject.amulets

        const buttonReadyLabel = leader ? (`Wyrusz`) : (`Gotów`)
        return(
            <div >
                <MissionBar>
                    <span>Mission {this.state.missionId}</span>
                    <StyledImg src={require(`../../../assets/avatar/${this.state.missionObject.avatarSrc}`)}/>
                    {`   `}
                    {requiredMissionItems.map((amulet) => {
                        return (
                            <React.Fragment key={amulet.itemModel.id}>
                                {` ${amulet.quantity}x`}
                                <StyledImg src={require(`../../../assets/icons/items/${amulet.itemModel.imgSrc}`)}/>
                            </React.Fragment>
                        )
                    })}
                </MissionBar>
                
                <ExchangeArea userId={randomUserId} locationId={this.props.location.state.id} setConnection={this.handleConnection} instanceItems={this.updateInstanceItems}/>
                {this.state.roomConnected ? (
                    
                    <PartyList userId={randomUserId} instanceItems={this.state.instanceItems}/>
                    ) : (
                    null
                )}
                <ButtonBar>
                    <Button onClick={this.handleBack} variant="contained" color="primary">
                        <KeyboardArrowLeftIcon
                        style={{
                            fontSize: "2rem",
                            transition: "transform 500ms ease-out",
                            
                        }}
                        />
                        Wyjdź
                        
                    </Button>
                    <Button onClick={this.handleReadyButton} disabled={this.checkConditions()} variant="contained" color="primary">
                        {buttonReadyLabel}
                        <ColorizeIcon
                        style={{
                            fontSize: "2rem",
                            transition: "transform 500ms ease-out",
                            
                        }}
                        />
                    </Button>
                
                </ButtonBar>
            </div>
        )
    }
  
    
    
}
