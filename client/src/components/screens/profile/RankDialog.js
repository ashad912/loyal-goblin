import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import {mockUsers} from '../../../utils/mocks'


const RankDialog = props => {
  

    const users = mockUsers

    let sortedUsers = users.sort((a, b)=> (a.experience < b.experience) ? 1 : -1)
    const myUserIndex = sortedUsers.findIndex((user) => {
        return user._id === props.uid
    })
    sortedUsers = sortedUsers.slice(0, 100)


    const designateUserLevel = (points) => {
        const a = 10;
        const b = 100;
        
        let previousThreshold = 0;
        for (let i=1; i<=100; i++) {
            const bottomThreshold = previousThreshold
            const topThreshold = previousThreshold + (a*(i**2) + b)

            if(points >= bottomThreshold && points < topThreshold){
                return i
            }
            previousThreshold = topThreshold;
        }
    }

    return (
        <Dialog style={{margin: '-24px'}} fullWidth open={props.open} onClose={props.handleClose}>
        <DialogTitle style={{padding: '1rem 1rem 0 1rem'}}>TopGoblin</DialogTitle>
        <DialogContent style={{padding: '1rem 1rem'}}>
            
            <List style={{ border: "1px solid grey", padding: '0' }} alignItems="flex-start">
                <ListItem >
                    <Grid container style={{alignItems: 'center'}}>
                        <Grid item xs={1}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', fontWeight: 'bold'}}>No.</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            
                        </Grid>
                        <Grid item xs={5}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', fontWeight: 'bold'}}>Użytkownik</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', fontWeight: 'bold'}}>Poz.</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', fontWeight: 'bold'}}>PD</Typography>
                        </Grid>
                    
                    </Grid>
                </ListItem>
                <ListItem style={{borderBottom: '1px solid black'}}>
                                        
                    <Grid container style={{alignItems: 'center'}}>
                        <Grid item xs={1}>
                            <Typography color="primary" style={{width: '100%', fontSize: '0.7rem'}}>{myUserIndex+1}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <img src={props.profile.avatar} style={{width: '16px', height: '16px', paddingLeft: '0.2rem'}}/>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography color="primary" style={{width: '100%', fontSize: '0.7rem'}}>{props.profile.name}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', textAlign: 'center'}}>{designateUserLevel(props.profile.experience)}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', textAlign: 'center'}}>{props.profile.experience}</Typography>
                        </Grid>
                    
                    </Grid>
                                        
                </ListItem>
    
                {sortedUsers.map((user, index) => {
                    return (
                        <React.Fragment>
                            <ListItem key={user._id}>
                                        
                                <Grid container style={{alignItems: 'center'}}>
                                    <Grid item xs={1}>
                                        <Typography color="primary" style={{width: '100%', fontSize: '0.7rem'}}>{index+1}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <img src={user.avatar} style={{width: '16px', height: '16px', paddingLeft: '0.2rem'}}/>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography color="primary" style={{width: '100%', fontSize: '0.7rem'}}>{user.name}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography style={{width: '100%', fontSize: '0.7rem', textAlign: 'center'}}>{designateUserLevel(user.experience)}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography style={{width: '100%', fontSize: '0.7rem', textAlign: 'center'}}>{user.experience}</Typography>
                                    </Grid>
                                
                                </Grid>
                                        
                            </ListItem>
                            {(users.length !== index + 1) && <Divider/>}
                        </React.Fragment>
                    );
                })}
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} variant="contained" color="primary">
            Wróć
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default RankDialog;