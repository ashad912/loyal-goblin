import React from 'react'
import moment from 'moment'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";

import {designateUserLevel} from '../../utils/methods'
import {createAvatarPlaceholder} from '../../utils/methods'
import { usersPath } from '../../utils/definitions';

const leaderIcon = (
    <Badge
        style={{height: 30, width:30, }}
        overlap="circle"
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
    >
         <Avatar style={{height: 30, width:30, fontSize: '0.9rem', backgroundColor: '#3f51b5'}}>L</Avatar>
    </Badge>
) 


const UserListItem = (props) => {

    const user = props.user
    return(
        <ListItem button key={user._id} style={{paddingTop: '0.1rem', paddingBottom: '0.1rem'}} >
            <Grid item xs={1}>
                {user.avatar ? 
                <img alt='' style={{width: '32px', height: '32px'}} src={usersPath + user.avatar} /> :
                <Avatar style={{width: '32px', height: '32px', fontSize: '0.9rem'}}>{createAvatarPlaceholder(user.name)}</Avatar>
                }
            </Grid>
            <Grid item xs={3}>
                <Typography>{user.name}</Typography>
            </Grid>
            <Grid item xs={1} style={{textAlign: 'center'}}>
                <Typography variant="caption">{'Poziom ' + designateUserLevel(user.experience)}</Typography>
            </Grid>
            <Grid item xs={!props.hideBan ? 2 : 3} style={{textAlign: 'center'}}>
                <Typography variant="caption">{user.experience + ' PD'}</Typography>
            </Grid>
            <Grid item xs={3} style={{textAlign: 'center'}}>
                <Typography variant="caption">
                {user.active ? ('Aktywny ' + moment(user.lastActivityDate).fromNow()) : ((!user.hasOwnProperty('name') || !user.name.length) ? ('Nowy') : ('Zbanowany'))}
                </Typography>
            </Grid>
            <Grid item xs={!props.hideBan ? 2 : 1} style={{textAlign: 'right'}}>
                {!props.hideBan && <Button color="secondary" onClick={() => props.handleToggleBan(user)}>{user.active ? ('Zbanuj') : ('Odbanuj')}</Button>}
                {props.leaderIcon && leaderIcon}
            </Grid>
        </ListItem>
    )
}

export default UserListItem