import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import AwardListItem from '../events/AwardListItem'





const NewRallyAwardsDialog = props => {
  

  const handleClose = () => {
    props.clearRallyAwards()
  }

  return (
    <Dialog style={{margin: '-24px'}} fullWidth open={props.open} onClose={handleClose}>
      <DialogTitle>Rajd zakończony!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          O to Twoje nagrody!
        </DialogContentText>
        <List component="nav" style={{ width: "100%" }}>
          {props.profile.newRallyAwards.map(award => {
            return (
              <AwardListItem key={award.itemModel._id} item={award} />
            );
          })}
        </List>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Dzięki!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewRallyAwardsDialog;
