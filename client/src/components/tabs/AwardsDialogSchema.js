import React from "react";
import PropTypes from 'prop-types'
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const AwardsDialogSchema = ({open, handleClose, title, biggerHeader, header, list}) => {
  
  const minHeaderHeight = biggerHeader ? '5vh' : '17vh'
  
  return (
    <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        style={{
            margin: '-24px', 
            textAlign: 'center'
        }}   
    >
        <DialogTitle variant='h5'>{title}</DialogTitle>
        <DialogContent 
            style={{minHeight: minHeaderHeight}}
        >
            {header}
        </DialogContent>
        <DialogContent>
            {list}
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          <Typography>Dzięki</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AwardsDialogSchema.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    biggerHeader: PropTypes.bool.isRequired,
    header: PropTypes.element.isRequired,
    list: PropTypes.element.isRequired,
}

export default AwardsDialogSchema;
