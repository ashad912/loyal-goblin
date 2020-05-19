import React from "react";
import {connect} from 'react-redux'
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { palette } from "../../../utils/definitions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { PintoTypography} from "../../../utils/fonts";

import {resetWarning} from 'store/actions/communicationActions'

const WarningDialog = (props) => {

  const warning = props.warning

  const handleModalAction = () => {
    console.log(warning.action)
    warning.action()
    props.resetWarning()
  }

  const endTexts = {
    mission: 'spowoduje opuszczenie misji, w której obecnie bierzesz udział.',
    order: 'spowoduje usunięcie aktywnego zamówienia.'
  }

  return (
    <Dialog open={Boolean(warning.action)} onClose={props.resetWarning} style={{zIndex: 4000}}>
      <DialogTitle style={{textAlign:'center'}}>Potwierdź wykonanie akcji</DialogTitle>
      <DialogContent> 
        <PintoTypography style={{color: palette.background.darkGrey}}>
          {warning.text} {endTexts[warning.type]}
        </PintoTypography> 
      </DialogContent>
      <DialogActions>
        <Button onClick={props.resetWarning}>Anuluj</Button>
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

const mapDispatchToProps = dispatch => {
  return {
    resetWarning: () => { dispatch(resetWarning())}
  };
};

const mapStateToProps = state => {
  return {
      warning: state.communication.warning
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WarningDialog);
