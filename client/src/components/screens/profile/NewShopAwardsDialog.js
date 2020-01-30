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





const NewShopAwardsDialog = props => {
  

  const handleClose = () => {
    props.clearShopAwards()
  }

  const {shopNotifications} = props.profile
  return (
    <Dialog style={{margin: '-24px'}} fullWidth open={props.open} onClose={handleClose}>
      <DialogTitle variant='h5'>Expienie zakończone!</DialogTitle>
      <DialogContent>
        {shopNotifications.experience > 0 &&
          <React.Fragment>
            <DialogContentText style={{marginBottom: '0.5rem'}}>
              Zdobyte doświadczenie:
            </DialogContentText>
            <Typography  style={{marginLeft: '1rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              +{props.profile.shopNotifications.experience} PD
            </Typography>
          </React.Fragment>
        }
        {shopNotifications.awards.length > 0 && 
          <React.Fragment>
            <DialogContentText style={{marginBottom: '0.5rem'}}>
              Oto Twoje nagrody!
            </DialogContentText>
            <List component="nav" style={{ width: "100%" }}>
              {props.profile.shopNotifications.awards.map(award => {
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

export default NewShopAwardsDialog;