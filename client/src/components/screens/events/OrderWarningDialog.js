import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { PintoTypography} from "../../../utils/fonts";

const OrderWarningDialog = ({text, open, handleClose, handleAction}) => {


  const handleModalAction = () => {
    
    handleClose()
    handleAction()
  }


  return (
    <Dialog open={open} onClose={handleClose} style={{zIndex: 4000}}>
      <DialogTitle>Potwierdź wykonanie akcji</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <PintoTypography>{text} spowoduje usunięcie aktywnego zamówienia.</PintoTypography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Anuluj</Button>
        <Button
          onClick={handleModalAction}
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

export default OrderWarningDialog;