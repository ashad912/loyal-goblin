import React from 'react'

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import styled from 'styled-components'
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { ListItemIcon } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';

import AvatarWithPlaceholder from 'components/AvatarWithPlaceholder';

import {palette, itemsPath, uiPaths} from 'utils/constants'


const StyledImage = styled.img`
    height: 25px;
    width: 25px;
    margin: 0 0.2rem 0 0;
`

const StyledRoot = styled.div`
    flex-grow: 3;
    margin-bottom: 1rem;
    width: 100%;
`

const StyledList = styled(List)`
    
    max-height: calc(100vh - 530px);
    width: 100%;
    overflow: auto;
    
`

const StyledTypo = styled(Typography)`
   padding-top: 0.5rem;
`

const StyledBox = styled(Box)`
    margin: 0.5rem 0;

`

const SmallAvatar = styled(Avatar)`

&&{
    width: 17px;
    height: 17px;
    background: white;
    border: 1px solid black;
}
`
//&& to overwrite root material ui styles!!
// && {
//     margin: 0.5rem 2rem 0.5rem 2rem;
// }
// const createTempPartyList = () => {
//     return [
//         {
//             inRoom: false,
//             readyStatus: false,
//             profile: {
//                 _id: 1,
//                 name: 'user1',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             profile: {
//                 _id: 2,
//                 name: 'user2',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             profile: {
//                 _id: 3,
//                 name: 'user3 halo',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             profile: {
//                 _id: 4,
//                 name: 'user4 halo',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: false,
//             readyStatus: false,
//             profile: {
//                 _id: 5,
//                 name: 'user5',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: true,
//             readyStatus: false,
//             profile: {
//                 _id: 6,
//                 name: 'user6',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: true,
//             readyStatus: false,
//             profile: {
//                 _id: 8,
//                 name: 'user8',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//         {
//             inRoom: true,
//             readyStatus: false,
//             profile: {
//                 _id: 7,
//                 name: 'user7',
//                 avatar: undefined,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//     ]
// }



const PartyList = (props) => {

    const altAvatar = (user) => {


        
        return(
            <Badge
                style={{height: 30, width:30, }}
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={<SmallAvatar alt="bag avatar" src={uiPaths['chest']} />}
            >
                <AvatarWithPlaceholder 
                    avatar={user.avatar}
                    width="30px"
                    height="30px"
                    placeholder={{
                        text: user.name,
                    }}
                    style={{
                        backgroundColor: palette.primary.main
                    }}
                />
               
            </Badge>
        )
        //return <img style={{height: 30, width:30}} src={user.avatar} alt='avatar'/>
        
        
    }

    const statusIcon = (readyStatus) => readyStatus ? (
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

    
    
    const instanceItems = props.instanceItems


    //const partyList from props.partyList from socket.io methods

    //show only rest of the party
    const party = props.instanceUsers.filter((user) => {
        return user.profile._id !== props.userId
    })

    const leaderIcon = () => {

        return (
            <Badge
                style={{height: 30, width:30, }}
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                 <Avatar style={{height: 30, width:30, backgroundColor: palette.primary.main}}>L</Avatar>
            </Badge>
        )
    }

    return (
        <StyledRoot>
            {party.length > 0 && (
                <Paper square elevation={0} variant="outlined">
                <StyledTypo variant="h5">Drużyna</StyledTypo>
                
                <StyledList >
                {party.map((member) => {
                    return(
                    
                        <StyledBox key={member._id} border={0} borderColor="primary.main" style={{background: palette.background.standard}}>
                            <ListItem style={{paddingRight: '0.5rem'}}>
                                <Grid item style={{flexBasis: '18%'}}>
                             
                                    <ListItemAvatar style={{minWidth: 32}}>
                                        {member.inMission ? (
                                            <React.Fragment>
                                                {altAvatar(member.profile)}
                                            </React.Fragment>
                                        ) : (
                                            <CircularProgress style={{height: 30, width: 30}}/>
                                        )}
                                    </ListItemAvatar>
                                </Grid>
                                   
                                <Grid item style={{flexBasis: '67%'}}>
                                    
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                        spacing={1}
                                    >
                                        {instanceItems.map((item) => {  
                                            return(
                                                <React.Fragment key={item._id}>
                                                    {item.owner === member.profile._id ? (
                                                        <StyledImage  src={`${itemsPath}${item.itemModel.imgSrc}`} alt='icon'/>
                                                    ) : (
                                                        null
                                                    )}
                                                </React.Fragment>
                                            )
                                        })}
                                    </Grid>
                                        
                                </Grid>
                                <Grid style={{flexBasis: '15%', textAlign: 'end'}}>
                                    <ListItemIcon style={{minWidth: 32}}>
                                            {props.party.leader && (member.profile._id === props.party.leader._id) ? (leaderIcon()) : (statusIcon(member.readyStatus))}
                                    </ListItemIcon>
                                </Grid>
                            </ListItem>                            
                        </StyledBox>
                    )
                })}
                </StyledList>
                
                    
                </Paper>
            )}
            </StyledRoot>
    )
}

export default PartyList
