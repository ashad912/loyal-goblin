import React from 'react'
import PropTypes from 'prop-types'

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { palette } from "utils/constants";
import { PintoTypography} from "assets/fonts";

const OperationDialog = ({open, onClose, handleAction, title, desc, cancelText, confirmText}) => {
    return (
        <Dialog open={open} onClose={onClose} style={{ zIndex: 4000 }}>
            <DialogTitle style={{ textAlign: 'center' }}>{title}</DialogTitle>
            <DialogContent>
                <PintoTypography style={{ color: palette.background.darkGrey }}>
                    {desc}
                </PintoTypography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{cancelText}</Button>
                <Button
                    onClick={handleAction}
                    color="secondary"
                    variant="contained"
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

OperationDialog.propTypes ={
    open: PropTypes.any.isRequired,
    onClose: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    cancelText: PropTypes.string.isRequired,
    confirmText: PropTypes.string.isRequired,
}

export default OperationDialog