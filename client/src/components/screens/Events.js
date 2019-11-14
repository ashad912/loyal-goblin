import React, {useState}  from 'react'
import { Redirect} from 'react-router-dom'
import VisibilitySensor from 'react-visibility-sensor'
import MissionDetails from './events/MissionDetails'
import MissionListItem from './events/MissionListItem'
import withMissionItemCommon from './events/hoc/withMissionItemCommon'
import missionIconTemp from '../../assets/avatar/mission.png'
import List from '@material-ui/core/List';
import uuid from 'uuid/v1'
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components'
import moment from 'moment'

import Rally from './events/Rally'


const pathToIcons = '../../assets/icons/items'
const itemLabelHeight = 468.4 //REFACTOR: need to be changed to 'dimensionLabel'



const StyledList = styled(List)`
    width: 100%;
    margin: 0 0 1rem 0;
`


const createTempList = () => {
    return [
        {
            id: 1,
            title: 'Mission1',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 4,
            level: 1,
            strength: 1,
            dexterity: 2,
            magic: 3,
            endurance: 4,
            description: 'Super important mission. You need have things and attributes, as always loool xd Musiałem napisać więcej opisu, żeby przetestować jak to będzie wyglądać jak się rozwinie. Bo może być tak, że opis będzie taki długi i epicki, hehe.',
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
            ],
            awardsAreSecret: false,
            awards: {
                any: [
                    {
                        quantity: 2,
                        itemModel: {
                            _id: uuid(),
                            type: "feet",
                            class: 'any',
                            name: "Wysokie buty",
                            description: "Skórzane, wypastowane, lśniące",
                            imgSrc: "high-boots.png",
                            perks: [
                                {
                                _id: 1,
                                perkType: "disc-category",
                                target: 'food',
                                time: [
                                    {
                                        hoursFlag: true,
                                        lengthInHours: 24,
                                        startDay: 4,
                                        startHour: 18
                                    },
                                    { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
                                ],
                                value: "-10%"
                                }
                            ]
                        }
                    },
                    {
                        quantity: 1,
                        itemModel: {
                            _id: uuid(),
                            type: "legs",
                            name: "Lniane spodnie",
                            class: 'any',
                            description: "Zwykłe spodnie, czego jeszcze chcesz?",
                            imgSrc: "linen-trousers.png",
                            perks: []
                        }
                    }
                ],
                warrior: [
                    {
                        quantity: 1,
                        itemModel: {
                            _id: uuid(),
                            type: "weapon",
                            name: "Wielki miecz",
                            class: null,
                            description: "Zdecydowanie masz kompleksy",
                            imgSrc: "short-sword.png",
                            class: "warrior",
                            twoHanded: true,
                            perks: [
                                {
                                    _id: 1,
                                    perkType: "attr-strength",
                                    target: undefined,
                                    time: [
                                        {
                                            _id: 1,
                                            hoursFlag: false,
                                            lengthInHours: 5,
                                            startDay: 4,
                                            startHour: 19
                                        },
                                        {
                                            _id: 1,
                                            hoursFlag: true,
                                            lengthInHours: 1,
                                            startDay: 3,
                                            startHour: 18
                                        },
                                    ],
                                        value: "+3"
                                },
                                {
                                    _id: 13213,
                                    perkType: "attr-dexterity",
                                    target: undefined,
                                    time: [
                                        {
                                            _id: 1,
                                            hoursFlag: false,
                                            lengthInHours: 5,
                                            startDay: 4,
                                            startHour: 19
                                        },
                                        {
                                            _id: 1,
                                            hoursFlag: true,
                                            lengthInHours: 1,
                                            startDay: 3,
                                            startHour: 18
                                        },
                                    ],
                                        value: "-1"
                                    }
                            ]
                        }
                    }
                ],
                rogue: [
                    {
                        quantity: 1,
                        itemModel: {
                            _id: uuid(),
                            type: "chest",
                            name: "Skórzana kurta",
                            class: null,
                            description: "Lale za takimi szaleją",
                            imgSrc: "leather-jerkin.png",
                            perks: []
                        }
                    }
                ],
                mage: [
                    {
                        quantity: 2,
                        itemModel: {
                            _id: uuid(),
                            type: "head",
                            name: "Kaptur czarodzieja",
                            class: 'mage',
                            description: "Kiedyś nosił go czarodziej. Już nie nosi.",
                            imgSrc: "wizard-coul.png",
                            perks: [
                                {
                                perkType: "experience",
                                target: undefined,
                                time: [
                                    {
                                    _id: 1,
                                    hoursFlag: false,
                                    lengthInHours: 24,
                                    startDay: 4,
                                    startHour: 12
                                    }
                                ],
                                value: "+10%"
                                },
                                {
                                    perkType: "experience",
                                    target: undefined,
                                    time: [
                                        {
                                        _id: 1,
                                        hoursFlag: false,
                                        lengthInHours: 24,
                                        startDay: 4,
                                        startHour: 12
                                        }
                                    ],
                                    value: "+10"
                                    },
                                {
                                perkType: "experience",
                                target: undefined,
                                time: [
                                    {
                                    _id: 2,
                                    hoursFlag: false,
                                    lengthInHours: 24,
                                    startDay: 4,
                                    startHour: 12
                                    }
                                ],
                                value: "+20%"
                                }
                            ]
                        }
                    }
                ],
                cleric: [
                    {
                        quantity: 3,
                        itemModel: {
                            _id: uuid(),
                            type: "ring",
                            name: "Pierścień siły",
                            class: null,
                            description: "Całuj mój sygnet potęgi",
                            imgSrc: "strength-ring.png",
                            perks: [
                                {
                                    _id: 1,
                                    perkType: "disc-product",
                                    target: { name: "Wóda2" },
                                    time: [
                                    {
                                        hoursFlag: true,
                                        lengthInHours: 12,
                                        startDay: 4,
                                        startHour: 20,
                                    },
                                    { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
                                    ],
                                    value: "-15%"
                                }
                            ]
                        }
                    }
                ],
                
            }
        },
        {
            id: 2,
            title: 'Mission2',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 3,
            level: 3,
            strength: 5,
            dexterity: 3,
            magic: 2,
            endurance: 1,
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
            ],
            awardsAreSecret: false,
            awards: {
                any: [],
                warrior: [],
                rogue: [],
                mage: [],
                cleric: [],
            }
        },
        {
            id: 3,
            title: 'Mission3',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 4,
            level: 1,
            strength: 1,
            dexterity: 2,
            magic: 3,
            endurance: 4,
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
            ],
            awardsAreSecret: true,
            awards: {
                any: [],
                warrior: [],
                rogue: [],
                mage: [],
                cleric: [],
            }
        },
        {
            id: 4,
            title: 'Mission4',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 3,
            level: 3,
            strength: 5,
            dexterity: 3,
            magic: 2,
            endurance: 1,
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
            ],
            awardsAreSecret: true,
            awards: {
                any: [],
                warrior: [],
                rogue: [],
                mage: [],
                cleric: [],
            }
        },
        {
            id: 5,
            title: 'Mission5',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 4,
            level: 1,
            strength: 1,
            dexterity: 2,
            magic: 3,
            endurance: 4,
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
            ],
            awardsAreSecret: true,
            awards: {
                any: [],
                warrior: [],
                rogue: [],
                mage: [],
                cleric: [],
            }
        },
        {
            id: 6,
            title: 'Mission6',
            avatarSrc: {avatarTemp: missionIconTemp},
            minPlayers: 3,
            maxPlayers: 3,
            level: 3,
            strength: 5,
            dexterity: 3,
            magic: 2,
            endurance: 1,
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
            ],
            awardsAreSecret: true,
            awards: {
                any: [],
                warrior: [],
                rogue: [],
                mage: [],
                cleric: [],
            }
        },

    ]
}

const createTempRally = () => {
    return {
        id: 1,
        title: 'OMG!Rally',
        avatarSrc: missionIconTemp,
        date: moment().add(1, 'd'),
        requiredPlayers: 20,
        description: 'Super important rally. It is only one rally on board! You need to cooperate with ppl, u introvert scum xd',
        
    }
    //return undefined
}





const Events = () => {

    const [missionId, setMissionId] = useState(null);
    const [activeMissionDetails, setActiveMissionDetails] = useState(null)
    
    const rally = createTempRally() //returned from backend
    const missionListData = createTempList() //returned from backend

    const handleMissionClick = (id) => {
        console.log('clicked',  id) //shot to backend - verify party quantity and leader status (amulets verifed inside the mission), redirect to mission
        setMissionId(id)
    }

    const handleMissionDetailsOpen = (index) => {
        setActiveMissionDetails(missionListData[index])
    }

    const handleMissionDetailsClose = () => {
        setActiveMissionDetails(null)
    }

    //for better perfomance uses VisibilitySensor to load only visible (or partly visible) elements
    //to work need fixed listem item size (which is ok, i believe)
    const missionList = missionListData ? (
        missionListData.map((mission, index) => {
            const MissionListItemHoc = withMissionItemCommon(MissionListItem, mission)
            return(
                <VisibilitySensor partialVisibility key={mission.id}>
                {({isVisible}) =>
                    <div>{isVisible ? ( /*inVisible defined only inside div witch is fucking kurwa crazy */
                        <MissionListItemHoc
                            index={index}
                            handleMissionDetailsOpen={handleMissionDetailsOpen}
                        />   
                    ) : (<div style={{height: itemLabelHeight}}></div>)   /*empty div with the same height - IMPORTANT */
                    }
                    </div>
                }   
                </VisibilitySensor>
            )
        })
    ) : ( null )


    const MissionDetailsHoc = activeMissionDetails ? (withMissionItemCommon(MissionDetails, activeMissionDetails)) : (null)
    return (
        
        <React.Fragment>
            {missionId != null ?
             <Redirect to={{
                  pathname: '/mission',
                  state: { id: missionId}                                      
            }} /> : null}

            <Typography style={{marginBottom: '1rem'}} variant="h6" >
                Najbliższy rajd
            </Typography>

            <Rally rally={rally} />

            <Typography variant="h6">
                Dostępne misje
            </Typography>

            <StyledList> 
                {missionList}
            </StyledList>
            
                
            {activeMissionDetails && 
                <MissionDetailsHoc
                    open={activeMissionDetails}
                    handleClose={handleMissionDetailsClose}
                    handleMissionClick={handleMissionClick}
                />
            }   
            
                    
                
            
            

        </React.Fragment>
      
    )
}

export default Events
