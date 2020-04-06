import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { palette } from "../../../utils/definitions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { PintoTypography} from "../../../utils/fonts";

const ProfileMissionInstanceWarningDialog = ({text, open, handleClose, handleAction}) => {


  const handleModalAction = () => {
    
    handleClose()
    handleAction()
  }


  return (
    <Dialog open={open} onClose={handleClose} style={{zIndex: 4000}}>
      <DialogTitle>Potwierdź wykonanie akcji</DialogTitle>
      <DialogContent>
        <PintoTypography style={{color: palette.background.darkGrey}}>{text} spowoduje usunięcie misji, w której obecnie
        bierzesz udział.</PintoTypography>  
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

export default ProfileMissionInstanceWarningDialog;