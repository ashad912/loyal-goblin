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
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import {mockUsers} from '../../../utils/mocks'


const RankDialog = props => {
  

    const users = mockUsers

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
        <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Najlepsi</DialogTitle>
        <DialogContent>
            <DialogContentText>
            
            </DialogContentText>

            <List style={{ border: "1px solid grey" }} alignItems="flex-start">
            {users.map(user => {
                return (
                <ListItem key={user.id}>
                    <ListItemText
                    style={{ maxWidth: "60%" }}
                    primary={user.name}
                    secondary={"Doświadczenie " + user.experience + " Poziom " + designateUserLevel(user.experience)}
                    />
                    <ListItemAvatar>
                    <Typography variant="caption">
                    </Typography>
                    </ListItemAvatar>
                    <ListItemSecondaryAction>
                    
                    </ListItemSecondaryAction>
                </ListItem>
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