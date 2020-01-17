import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import AwardListItem from '../events/AwardListItem'





const NewRallyAwardsDialog = props => {
  

  const handleClose = () => {
    props.clearRallyAwards()
  }

  const {rallyNotifications} = props.profile
  return (
    <Dialog style={{margin: '-24px'}} fullWidth open={props.open} onClose={handleClose}>
      <DialogTitle variant='h5'>Rajd zakończony!</DialogTitle>
      <DialogContent>
        {rallyNotifications.experience > 0 &&
          <React.Fragment>
            <DialogContentText style={{marginBottom: '0.5rem'}}>
              Zdobyte doświadczenie:
            </DialogContentText>
            <Typography  style={{marginLeft: '1rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              +{props.profile.rallyNotifications.experience} PD
            </Typography>
          </React.Fragment>
        }
        {rallyNotifications.awards.length > 0 && 
          <React.Fragment>
            <DialogContentText style={{marginBottom: '0.5rem'}}>
              Oto Twoje nagrody!
            </DialogContentText>
            <List component="nav" style={{ width: "100%" }}>
              {props.profile.rallyNotifications.awards.map(award => {
                return (
                  <AwardListItem key={award.itemModel._id} item={award} />
                );
              })}
            </List>
          </React.Fragment>
        } 
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Dzięki
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewRallyAwardsDialog;
