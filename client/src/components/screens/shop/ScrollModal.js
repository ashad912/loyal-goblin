import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ScrollListItem from "./ScrollListItem";

const ScrollModal = ({open, handleClose, scrolls, equippedScrollId, handleScrollSelect}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        Zarządzaj zwojami
      </DialogTitle>
      <DialogContent>
        {scrolls.length>0 ? 

        
scrolls.map(scroll => {
    return (
        <ScrollListItem key={scroll._id} scroll= {scroll} equipped={scroll._id === equippedScrollId} handleScrollSelect={handleScrollSelect}/>
    )
}) :
<DialogContentText> Brak zwojów w ekwipunku </DialogContentText>
}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScrollModal;
