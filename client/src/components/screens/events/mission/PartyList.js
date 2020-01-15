import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import avatarTemp from '../../../../assets/avatar/moose.png'
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
import bagImg from '../../../../assets/avatar/bag.png'


import {createAvatarPlaceholder} from '../../../../utils/methods'
import {itemsPath, usersPath} from '../../../../utils/paths'

const StyledGrid = styled(Grid)`
    &&{
        margin: 0 0 0 1rem;
    }
    
`
const StyledImage = styled.img`
    height: 25px;
    width: 25px;
    margin: 0 0.2rem 0 0;
`

const StyledRoot = styled.div`
    flex-grow: 3;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const StyledList = styled(List)`
    max-height: 9rem;
    
    width: 100%;
    overflow: auto;
    
`

const StyledTypo = styled(Typography)`
   
`

const StyledBox = styled(Box)`
    margin: 0.5rem 0.5rem 0.5rem 0.5rem;

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
//             user: {
//                 _id: 1,
//                 name: 'user1',
//                 avatar: avatarTemp,
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
//             user: {
//                 _id: 2,
//                 name: 'user2',
//                 avatar: avatarTemp,
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
//             user: {
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
//             user: {
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
//             user: {
//                 _id: 5,
//                 name: 'user5',
//                 avatar: avatarTemp,
//                 party: {
//                     leader: {
//                         _id: 1
//                     }
//                 }
//             }
//         },
//     ]
//}



const PartyList = (props) => {

    const [partyList, setPartyList] = useState([...props.instanceUsers])


    const altAvatar = (user) => {


        
        return(
            <Badge
                style={{height: 30, width:30, }}
                overlap="circle"
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                badgeContent={<SmallAvatar alt="bag avatar" src={bagImg} />}
            >
                {user.avatar ? <Avatar style={{height: 30, width:30}} alt="avatar" src={usersPath + user.avatar} /> : <Avatar style={{height: 30, width:30, backgroundColor: '#3f51b5'}}>{createAvatarPlaceholder(user.name)}</Avatar>}
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
    const party = partyList.filter((user) => {
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
                 <Avatar style={{height: 30, width:30, backgroundColor: '#3f51b5'}}>L</Avatar>
            </Badge>
        )
    }

    return (
        <StyledRoot>
            {party.length > 0 && (
                <Paper>
                <StyledTypo variant="h5">Drużyna</StyledTypo>
                
                <StyledList >
                {party.map((member) => {
                    return(
                    
                        <StyledBox border={1} borderColor="primary.main">
                            <ListItem>
                            {member.inMission ? (
                                <ListItemAvatar style={{minWidth: 32}}>
                                    {altAvatar(member.profile)}
                                </ListItemAvatar>
                            ) :(  
                                <ListItemAvatar style={{minWidth: 32}}>
                                    <CircularProgress style={{height: 30, width: 30}}/>
                                </ListItemAvatar>
                            )}       
                                    <Grid item xs={10}>
                                        
                                            <StyledGrid
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
                                                            <StyledImage  src={`${itemsPath}${item.model.imgSrc}`} alt='icon'/>
                                                        ) : (
                                                            null
                                                        )}
                                                    </React.Fragment>
                                                )
                                                
                                                    
                                                    /*<img style={{height: 40, width:40}} src={require(`../../../../assets/icons/items/${item.model.imgSrc}`)} alt='icon'/>*/
                                                
                                            })}
                                            </StyledGrid>
                                        
                                </Grid>
                            
                                <ListItemIcon style={{minWidth: 32}}>
                                        {props.party.leader && (member.profile._id === props.party.leader._id) ? (leaderIcon()) : (statusIcon(member.readyStatus))}
                                </ListItemIcon>
                            </ListItem>
                        
                                
                            
                                {/* <ListItem>
                                    <ListItemAvatar style={{minWidth: 32}}>
                                            <CircularProgress style={{height: 50, width: 50}}/>
                                    </ListItemAvatar>
                                    <Grid item xs={10}></Grid>
                                    <ListItemIcon style={{minWidth: 32}}>
                                        {props.party.leader && (member.profile._id === props.party.leader._id) ? (leaderIcon()) : (statusIcon(member.readyStatus))}
                                    </ListItemIcon>
                                </ListItem> */}
                            
                            
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
