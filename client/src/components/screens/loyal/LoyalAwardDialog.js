import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import AwardListItem from '../AwardListItem'


const LoyalAwardsDialog = props => {
  

  const handleClose = () => {
    props.handleClose()
  }

  const award = props.award
  return (
    <Dialog style={{margin: '-24px'}} fullWidth open={props.open} onClose={handleClose}>
      <DialogTitle variant='h5'>Flota zestrzelona!</DialogTitle>
      <DialogContent>
          <React.Fragment>
            <DialogContentText style={{marginBottom: '0.5rem'}}>
               O to Twoja nagroda!
            </DialogContentText>
            <List component="nav" style={{ width: "100%" }}>
                
                <AwardListItem key={award.itemModel._id} item={award} />
                
            </List>
          </React.Fragment>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Dzięki
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoyalAwardsDialog;