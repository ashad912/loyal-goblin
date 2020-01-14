import React from 'react'
import moment from 'moment'
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";



import {designateUserLevel} from '../utils/methods'

import {createAvatarPlaceholder} from '../../../utils/methods'



const OrderListItem = (props) => {

    const order = props.order
    return(
        <ListItem button key={order._id} style={{paddingTop: '0.1rem', paddingBottom: '0.1rem'}} >
            <Grid item xs={4} style={{textAlign: 'left'}}>
                <ListItemText primary={moment(order.createdAt).format("L, LTS")} />
            </Grid>
            <Grid item xs={5} style={{textAlign: 'center'}}>
                <ListItemText primary={order.leader.name} />
            </Grid>
            <Grid item xs={3} style={{textAlign: 'right'}}>
                <ListItemText primary={order.totalPrice + ' PLN'} />
            </Grid>
        </ListItem>
    )
}

export default OrderListItem