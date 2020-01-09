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
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import {mockUsers} from '../../../utils/mocks'
import {designateUserLevel} from '../../../utils/methods'
import { getRankedUsers } from "../../../store/actions/profileActions";

import {createAvatarPlaceholder} from "../../../utils/methods";


const RankDialog = props => {
  
    const [users, setUsers] = React.useState([])
    const [myUserIndex, setMyUserIndex] = React.useState(0)

    React.useEffect(() => {
        const fetchRankedUsers = async () => {
            const data = await getRankedUsers()
            setMyUserIndex(data.userIndex)
            setUsers(data.users)
            console.log(data.users)
        }

        fetchRankedUsers()
    }, [])


    // let sortedUsers = users.sort((a, b)=> (a.experience < b.experience) ? 1 : -1)
    // const myUserIndex = sortedUsers.findIndex((user) => {
    //     return user._id === props.uid
    // })
    // sortedUsers = sortedUsers.slice(0, 100)




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
                            <Typography style={{width: '100%', fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center'}}>Poz.</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography style={{width: '100%', fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center'}}>PD</Typography>
                        </Grid>
                    
                    </Grid>
                </ListItem>
                <ListItem style={{borderBottom: '1px solid black'}}>
                                        
                    <Grid container style={{alignItems: 'center'}}>
                        <Grid item xs={1}>
                            <Typography style={{width: '100%', fontSize: '0.7rem'}}>{myUserIndex+1}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            {props.profile.avatar ? 
                                <img style={{width: '16px', height: '16px', paddingLeft: '0.2rem'}} alt="avatar" src={'/images/user_uploads/' + props.profile.avatar} /> :
                                <Avatar style={{width: '16px', height: '16px', fontSize: '0.6rem'}}>{createAvatarPlaceholder(props.profile.name)}</Avatar>
                            }
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
    
                {users.map((user, index) => {
                    return (
                        <React.Fragment key={user._id}>
                            <ListItem key={user._id}>
                                        
                                <Grid container style={{alignItems: 'center'}}>
                                    <Grid item xs={1}>
                                        <Typography style={{width: '100%', fontSize: '0.7rem'}}>{index+1}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                    {props.profile.avatar ? 
                                        <img style={{width: '16px', height: '16px', paddingLeft: '0.2rem'}} alt="avatar" src={'/images/user_uploads/' + props.profile.avatar} /> :
                                        <Avatar style={{width: '16px', height: '16px', fontSize: '0.6rem'}}>{createAvatarPlaceholder(props.profile.name)}</Avatar>
                                    }
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