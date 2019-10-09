import React, {useState}  from 'react'
import { Redirect} from 'react-router-dom'
import VisibilitySensor from 'react-visibility-sensor'
import missionIconTemp from '../../assets/avatar/mission.png'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import styled from 'styled-components'
import moment from 'moment'
import playersIcon from '../../assets/avatar/players.png'


const pathToIcons = '../../assets/icons/items'
const itemLabelHeight = 170 //REFACTOR: need to be changed to 'dimensionLabel'


const StyledCard = styled(Card)`
    min-width: 275px;
    margin: 0 0 1rem 0;
`
const StyledList = styled(List)`
    width: 100%;
    margin: 0 0 1rem 0;
`
const StyledBox = styled(Box)`
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;

`

const Bullet = styled.span`
    display: inline-block;
    margin: 0 2px 0 0;
    transform: scale(0.8);
`
const RallyPlaceholder = styled.div`
    display: flex;
    height: 100%;
    width: auto;
    justify-content: center;
    align-items: center;
    margin: 0 0 1rem 0;
    
`
const TitleMissionContainer = styled.div`
    width: auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`
const createTempList = () => {
    return [
        {
            id: 1,
            title: 'Mission1',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {
                    quantity: 2,
                    itemModel: {
                        id: 101,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'diamond',
                        imgSrc: 'diamond-amulet.png'
                    }
                },
                {
                    quantity: 1,
                    itemModel: {
                        id: 102,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'pearl',
                        imgSrc: 'pearl-amulet.png'
                    }
                },
            ]
        },
        {
            id: 2,
            title: 'Mission2',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 3,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {
                    quantity: 2,
                    itemModel: {
                        id: 103,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'sapphire',
                        imgSrc: 'sapphire-amulet.png'
                    }
                },
                {
                    quantity: 1,
                    itemModel: {
                        id: 101,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'diamond',
                        imgSrc: 'diamond-amulet.png'
                    }
                },
                {
                    quantity: 2,
                    itemModel: {
                        id: 102,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'pearl',
                        imgSrc: 'pearl-amulet.png'
                    }
                },
            ]
        },
        {
            id: 3,
            title: 'Mission3',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {
                    quantity: 2,
                    itemModel: {
                        id: 101,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'diamond',
                        imgSrc: 'diamond-amulet.png'
                    }
                },
                {
                    quantity: 1,
                    itemModel: {
                        id: 102,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'pearl',
                        imgSrc: 'pearl-amulet.png'
                    }
                },
            ]
        },
        {
            id: 4,
            title: 'Mission4',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 3,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {
                    quantity: 2,
                    itemModel: {
                        id: 103,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'sapphire',
                        imgSrc: 'sapphire-amulet.png'
                    }
                },
                {
                    quantity: 1,
                    itemModel: {
                        id: 101,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'diamond',
                        imgSrc: 'diamond-amulet.png'
                    }
                },
                {
                    quantity: 2,
                    itemModel: {
                        id: 102,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'pearl',
                        imgSrc: 'pearl-amulet.png'
                    }
                },
            ]
        },
        {
            id: 5,
            title: 'Mission5',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {
                    quantity: 2,
                    itemModel: {
                        id: 101,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'diamond',
                        imgSrc: 'diamond-amulet.png'
                    }
                },
                {
                    quantity: 1,
                    itemModel: {
                        id: 102,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'pearl',
                        imgSrc: 'pearl-amulet.png'
                    }
                },
            ]
        },
        {
            id: 6,
            title: 'Mission6',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 3,
            description: 'Super important mission. You need have things and attributes, as always loool xd',
            amulets: [
                {
                    quantity: 2,
                    itemModel: {
                        id: 103,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'sapphire',
                        imgSrc: 'sapphire-amulet.png'
                    }
                },
                {
                    quantity: 1,
                    itemModel: {
                        id: 101,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'diamond',
                        imgSrc: 'diamond-amulet.png'
                    }
                },
                {
                    quantity: 2,
                    itemModel: {
                        id: 102,
                        type: {
                            id: 201,
                            type: 'amulet'
                        },
                        name: 'pearl',
                        imgSrc: 'pearl-amulet.png'
                    }
                },
            ]
        },

    ]
}

const createTempRally = () => {
    return {
        id: 1,
        title: 'OMG!Rally',
        avatarSrc: missionIconTemp,
        date: moment().add(1, 'days').calendar(),
        requiredPlayers: 20,
        description: 'Super important rally. It is only one rally on board! You need to cooperate with ppl, u introvert scum xd',
        
    }
    //return undefined
}



const handleRallyClick = () => {
    console.log('clicked rally')
}


const Events = () => {

    const [missionId, setMissionId] = useState(null);
    

    const handleMissionClick = (id) => {
        console.log('clicked',  id) //shot to backend - verify party quantity and leader status (amulets verifed inside the mission), redirect to mission
        setMissionId(id)
    }

    const isMissionActive = (minPlayers, maxPlayers) => {
        return (currentPlayersInParty >= minPlayers && currentPlayersInParty <= maxPlayers)
    } 
    const players = (minPlayers, maxPlayers) => {
        if(minPlayers === maxPlayers){
            return minPlayers
        }else {
            return `${minPlayers}-${maxPlayers}`
        }

    }


    const currentPlayersInParty = 4; //returned from backend (read from user profile -> user.party.members.length + 1 [1 for leader] EXPERIMENTAL)
    const leader = true //only leader can enter mission - from backend as above
    
    const rally = createTempRally() //returned from backend
    const missionListData = createTempList() //returned from backend
    //one shot to events can be separated (rally, missions) on back/front
    
    

    //for better perfomance uses VisibilitySensor to load only visible (or partly visible) elements
    //to work need fixed listem item size (which is ok, i believe)
    const missionList = missionListData ? (
        missionListData.map(mission => {
            const missionActive = isMissionActive(mission.minPlayers, mission.maxPlayers)
            return(
                <VisibilitySensor partialVisibility key={mission.id}>
                {({isVisible}) =>
                    <div>{isVisible ? ( /*inVisible defined only inside div witch is fucking kurwa crazy */
                        <StyledBox border={1} borderColor="primary.main">
                        <ListItem style={{height: itemLabelHeight, paddingRight: '2rem'}} alignItems="flex-start"> 
                            <ListItemAvatar>
                                <Avatar alt="avatar" src={mission.avatarSrc.avatarTemp} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <TitleMissionContainer>
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        color="textPrimary"
                                    >
                                        {mission.title}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        style={{display: 'inline-flex'}}
                                        variant="body2"
                                        color={missionActive ? 'textPrimary' : 'error'}
                                    >
                                        <img style= {{height: 20, width: 20}} src={playersIcon}/>
                                        {`: ${players(mission.minPlayers, mission.maxPlayers)}`}
                                    </Typography>
                                    </TitleMissionContainer>
                                }
                                secondary={
                                    <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        style={{display: 'block'}}
                                        color="textPrimary"
                                    >
                                        {mission.description}
                                    </Typography>
                                    <br />
                                    {mission.amulets ? (
                                        mission.amulets.map(amulet => {
                                            //TODO: Fix problem with webpack.
                                            //console.log(`../../assets/icons/${amulet.itemModel.imgSrc}`) //this works
                                            //console.log(`${pathToIcons}${amulet.itemModel.imgSrc}`) // does not work
                                            //console.log(pathToIcons + amulet.itemModel.imgSrc) //does not work

                                            
                                            
                                            return(
                                                <React.Fragment key={amulet.itemModel.id}>
                                                    {`${amulet.quantity}x`}
                                                    <img style={{height: 20, width: 20}} src={require(`../../assets/icons/items/${amulet.itemModel.imgSrc}`)} alt='icon'/>
                                                    {` `}
                                                </React.Fragment>
                                                )
                                            })
                                        ):(null)
                                    }
                                    
                                    </React.Fragment>
                                }  
                            />

                         
                            
                            <ListItemSecondaryAction style={{transform: 'translateY(50%)'}}>
                                <Button size="small" onClick={() => handleMissionClick(mission.id)} disabled={!missionActive || !leader}>{leader ? ('Go in!') : ('You are not the leader!')}</Button>
                            </ListItemSecondaryAction>
                            
                            
                        </ListItem>
                        
                        </StyledBox>
                           
                    ) : (<div style={{height: itemLabelHeight}}></div>)   /*empty div with the same height - IMPORTANT */
                    }
                    </div>
                }   
                </VisibilitySensor>
            )
        })
    ) : ( null )

    
    return (
        
        <React.Fragment>
            {missionId != null ?
             <Redirect to={{
                  pathname: '/mission',
                  state: { id: missionId}                                      
            }} /> : null}

            <Typography style={{marginBottom: '1rem'}} variant="h6" >
                Rally
            </Typography>


            {rally ? (
                <StyledCard>
                    <CardContent>
                        <Typography style={{fontSize: 14}} color="textSecondary" gutterBottom>
                            Ladies and Gentelmen!
                        </Typography>
                        <Typography variant="h5" component="h2">
                            oo
                        <Bullet>•</Bullet>
                            {rally.title}
                        <Bullet>•</Bullet>
                            oo
                        </Typography>
                        <Typography style={{marginBottom: '0.5rem'}} color="textSecondary">
                            {rally.date}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {rally.description}
                        <br />
                        {'"Treasurrrre!"'}
                        </Typography>
                    </CardContent>
                    <CardActions style={{justifyContent: 'flex-end'}}>
                        <Button onClick={handleRallyClick} size="small">Go in!</Button>
                    </CardActions>
                </StyledCard>
            ) : (<RallyPlaceholder>There is no active really!</RallyPlaceholder>)}


            <Typography variant="h6">
                Missions
            </Typography>

            <StyledList>
                
                
                {missionList}
            </StyledList>
        
        </React.Fragment>
      
    )
}

export default Events
