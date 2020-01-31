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
      fullWidth
      maxWidth="xl"
      PaperProps={{style: {width: '100%', margin: '1rem'}}}

    >
      <DialogTitle>
        Zarządzaj zwojami
      </DialogTitle>
      <DialogContent>
        {scrolls.length > 0 ? scrolls.map((scroll, index) => {

          return (
        <ScrollListItem key={scroll._id} isFirst={index===0} scroll= {scroll} equipped={scroll._id === equippedScrollId} handleScrollSelect={handleScrollSelect}/>
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
