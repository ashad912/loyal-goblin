import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from '@material-ui/core/Avatar';
import { Badge } from '@material-ui/core';
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";


import tempUserAvatar from '../../../assets/avatar/moose.png'
import styled from 'styled-components'
import uuid from 'uuid/v1'
import {createAvatarPlaceholder} from "../../../utils/methods";
import {itemsPath, usersPath} from '../../../utils/paths'

const Background = styled.div`
    background-color: #3f51b5;
    color: white;
`


const StatsDialog = props => {
  


    //const avatar = true
    const height = 100
    const width = 100

    const amuletCounters = [
        {
            _id: uuid(),
            counter: 2,
            amulet: {
                _id: uuid(),
                name: 'diamond',
                description: 'Najlepszy przyjaciel dziewczyny',
                type: 'amulet',
                imgSrc: 'diamond-amulet.png',
            }
        },
        {
            _id: uuid(),
            counter: 3,
            amulet: {
                _id: uuid(),
                name: 'pearl',
                description: 'Perła prosto z małży, znaczy z lodówki',
                type: 'amulet',
                imgSrc: 'pearl-amulet.png',
            }
        }
    ] //props.profile.statistics.amuletCounters

    return (
        <Dialog style={{margin: '-24px'}} fullWidth open={props.open} onClose={props.handleClose}>
        <DialogContent style={{padding: '0'}}>
            <Background>
                <Grid 
                    container 
                    direction='column'
                    justify='center'
                    alignItems='center'
                    style={{padding: '2rem 0 2rem 0'}}
                >
                    <Grid item>
                        <Badge
                            style={{height: height, width: width, marginRight: '0.5rem'}}
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            {props.profile.avatar ? <Avatar style={{height: height, width: width}} alt="avatar" src={usersPath + props.profile.avatar} /> : <Avatar style={{height: height, width: width, fontSize: '3.7rem'}}>{createAvatarPlaceholder(props.profile.name)}</Avatar>}
                        </Badge>
                    </Grid>
                    <Grid item style={{padding: '1rem 0 0 0'}}>
                        <Typography variant="h4">
                            {props.profile.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Background>
            </DialogContent>
            <DialogContent style={{padding: '0'}}>
            <List style={{padding: '0', maxHeight: '172px' }} alignItems="flex-start">
                <ListItem style={{paddingTop: '0.75rem', paddingBottom: '0.75rem'}}>
                    <Grid container style={{alignItems: 'center'}}>
                        <Grid item xs={11}>
                            <Typography>Ukończone rajdy</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography style={{fontWeight: 'bold'}}>{props.profile.statistics.rallyCounter}</Typography>
                        </Grid>
                    
                    </Grid>
                </ListItem>
                <Divider/>
                <ListItem style={{paddingTop: '0.75rem', paddingBottom: '0.75rem'}}>
                    <Grid container style={{alignItems: 'center'}}>
                        <Grid item xs={11}>
                            <Typography>Ukończone misje</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography style={{fontWeight: 'bold'}}>{props.profile.statistics.missionCounter}</Typography>
                        </Grid>
                    
                    </Grid>
                </ListItem>
                <Divider/>
    
                {amuletCounters.map((amuletCounter, index) => {
                    return (
                        <React.Fragment key={amuletCounter._id}>
                            <ListItem style={{paddingTop: '0.75rem', paddingBottom: '0.75rem'}}>
                                        
                                <Grid container>
                                <Grid item xs={11} style={{display: 'flex', alignItems: 'center'}}>
                                    <Typography>Wydane</Typography>
                                    <img src={itemsPath + amuletCounter.amulet.imgSrc} style={{width: '20px', height: '20px', padding: '0 0.2rem 0 0.2rem'}}/>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography style={{width: '100%', fontWeight: 'bold'}}>{amuletCounter.counter}</Typography>
                                </Grid>
                                
                                </Grid>
                                        
                            </ListItem>
                             <Divider/>
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

export default StatsDialog;