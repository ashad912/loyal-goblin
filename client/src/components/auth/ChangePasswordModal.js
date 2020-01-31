import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Recaptcha from 'react-google-invisible-recaptcha';
import { Typography } from "@material-ui/core";
import { changePassword, signOut } from "../../store/actions/authActions";


class ChangePasswordModal extends React.Component {

  state = {
    oldPassword: '',
    password: '',
    repeatedPassword: '',
    showError: false
  }


  
  handleOldPasswordChange = e => {
    this.setState({oldPassword: e.target.value});
  };

  handlePasswordChange = e => {
    this.setState({password: e.target.value});
    if (this.state.password && this.state.repeatedPassword && this.state.showError) {
      if (e.target.value === this.state.repeatedPassword) {
        this.setState({showError: false});
      }
    }
  };

  handleRepeatedPasswordChange = e => {
    this.setState({repeatedPassword: e.target.value});
    if(this.state.password && e.target.value && this.state.password !== e.target.value){
      this.setState({showError: true});
    }
    if (this.state.password && this.state.repeatedPassword && this.state.showError) {
      if (e.target.value === this.state.password) {
        this.setState({showError: false});
      }
    }
  };
  handleSubmit = async e => {
    if (this.state.password === this.state.repeatedPassword && this.state.oldPassword && this.state.password.length >= 7 && this.state.repeatedPassword.length >= 7) {
      this.recaptcha.execute();

    } else {
      this.setState({showError: true});
      this.recaptcha.reset();
    }
  };
  
  onCaptchaResolved = async () => {
    await this.props.onChangePassword(this.state.oldPassword, this.state.password, this.state.repeatedPassword, this.recaptcha.getResponse());
    this.setState({showError: false, oldPassword: '', password: '', repeatedPassword: ''});
    this.props.handleClose()
    this.props.signOut()
  }
  
  
  render() {
    const open = this.props.open
    const handleClose = this.props.handleClose

    return (
<Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Zmiana hasła</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Wpisz aktualne hasło oraz nowe hasło, majace minimum 7 znaków i różniące się od
          aktualnego. Po zatwierdzeniu nastąpi wylogowanie.
        </DialogContentText>
        {this.state.showError && (
          <Typography variant="caption" style={{ color: "#c30000" }}>
            Podane hasła nie są takie same
          </Typography>
        )}
        <TextField
          value={this.state.oldPassword}
          onChange={this.handleOldPasswordChange}
          autoFocus
          margin="dense"
          label="Aktualne hasło"
          type="password"
          fullWidth
        />
        <TextField
          value={this.state.password}
          onChange={this.handlePasswordChange}
          margin="dense"
          label="Nowe hasło"
          type="password"
          fullWidth
        />
        <TextField
          value={this.state.repeatedPassword}
          onChange={this.handleRepeatedPasswordChange}
          margin="dense"
          label="Powtórz nowe hasło"
          type="password"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Anuluj
        </Button>
        <Button
          onClick={this.handleSubmit}
          color="primary"
          variant="contained"
          disabled={
            this.state.password.length <= 0 || this.state.repeatedPassword.length <= 0 || this.state.showError
          }
        >
          Zatwierdź
        </Button>
      </DialogActions>
      <Recaptcha
                  ref={ ref => this.recaptcha = ref }
                  sitekey="6Ldy0ssUAAAAAKSZNuXULGv4U1PBI35BbvbWhT9x"
                  onResolved={ this.onCaptchaResolved }
              />
    </Dialog>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    onChangePassword: (oldPassword, password, repeatedPassword, token) =>
      dispatch(changePassword(oldPassword, password, repeatedPassword, token)),
    signOut: () => dispatch(signOut())
  };
};

export default connect(null, mapDispatchToProps)(ChangePasswordModal);
