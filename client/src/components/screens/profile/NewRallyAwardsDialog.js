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
import { PintoTypography } from "../../../utils/fonts";





const NewRallyAwardsDialog = props => {
  

  const handleClose = () => {
    props.clearRallyAwards()
  }

  const {rallyNotifications} = props.profile
  const minHeaderHeight = rallyNotifications.experience <= 0 ? '5vh' : '15vh'
  
  return (
    <Dialog style={{margin: '-24px -24px 10px -24px'}}  fullWidth open={props.open} onClose={handleClose}>
      <DialogTitle variant='h5'>Rajd zakończony!</DialogTitle>
      <DialogContent style={{minHeight: minHeaderHeight}}>
        {rallyNotifications.experience > 0 &&
          <React.Fragment>
            <DialogContentText style={{marginBottom: '0.5rem'}}>
              Zdobyte doświadczenie:
            </DialogContentText>
            <PintoTypography  style={{marginLeft: '1rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              +{props.profile.rallyNotifications.experience} PD
            </PintoTypography>
          </React.Fragment>
        }
        {rallyNotifications.awards.length > 0 && 
            <DialogContentText style={{marginBottom: '0.5rem'}}>
              Oto Twoje nagrody!
            </DialogContentText>
        }
        </DialogContent>
        <DialogContent>
        {rallyNotifications.awards.length > 0 && 
          <React.Fragment>
            
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
        <Button onClick={handleClose} color="primary">
        <PintoTypography>Dzięki</PintoTypography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewRallyAwardsDialog;
