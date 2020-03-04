import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const OfflineModal = ({open}) => {
  return (
<Dialog
        style={{zIndex: 1000}}
        open={open}
      >
        <DialogTitle>Brak połączenia z Internetem!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do korzystania z aplikacji konieczne jest aktywne połączenie z Internetem.
          </DialogContentText>
        </DialogContent>

      </Dialog>
  )
}

export default OfflineModal
