import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


const PartyMissionInstanceWarningDialog = props => {

    const handleAction = () => {
        props.handleClose()
        props.confirmAction()
    }

  return (
    <Dialog open={props.open} onClose={props.handleClose} style={{zIndex: 4000}}>
      <DialogTitle>Potwierdź wykonanie akcji</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Modyfikacja składu drużyny spowoduje usunięcie misji, w której obecnie
          bierzecie udział.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Anuluj</Button>
        <Button
          onClick={handleAction}
          color="secondary"
          variant="contained"
          autoFocus
        >
          Zatwierdź
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartyMissionInstanceWarningDialog;
