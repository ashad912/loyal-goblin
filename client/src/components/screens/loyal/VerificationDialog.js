import React from "react";

import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import styled from 'styled-components'





class VerificationDialog extends React.Component{

  constructor() {
    super();
    this.state = {seconds: 60 };
    this.timer = 0;
  }

 

  componentDidUpdate(prevProps){
    if(prevProps.open === false && this.props.open === true) {
      this.timer = setInterval(this.countDown, 1000);
      this.setState({
        seconds: 60,
      });
    }
  }
  
  countDown = () => {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });

    if (seconds == 0) { 
      clearInterval(this.timer);
      this.handleClose()
    }

  }

  handleClose = () => { //MODIFY: close on socket info? or interval shot (one per 5 sec through minute)
    clearInterval(this.timer);
    this.props.handleClose()
  }
  render(){
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle align='center'><p>Wstawiony?</p>Dasz radę pokazać QRa przy barze?</DialogTitle>
        <DialogContentText align='center'>
          {`${this.state.seconds} s`}
        </DialogContentText>
        <Divider />
        <DialogContent align='center'>
          <img src={require("../../../assets/mocks/mock-qr.png")} />
          
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={this.handleClose} variant="contained" color="primary">
            Zrobione!
          </Button>
        </DialogActions> */}
      </Dialog>
    );
  }
  
};

export default VerificationDialog;
