import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PintoTypography } from '../../assets/fonts';
import { palette } from '../../utils/constants';

const OfflineModal = ({open}) => {
  return (
<Dialog
        style={{zIndex: 1000}}
        open={open}
      >
        <DialogTitle>Brak połączenia z Internetem!</DialogTitle>
        <DialogContent>
          <PintoTypography style={{color: palette.background.darkGrey}}>
            Do korzystania z aplikacji konieczne jest aktywne połączenie z Internetem.
            </PintoTypography>
        </DialogContent>

      </Dialog>
  )
}

export default OfflineModal
