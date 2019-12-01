import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import { changePassword, signOut } from "../../store/actions/authActions";

const ChangePasswordModal = (props) => {
    const open = props.open
    const handleClose = props.handleClose
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    if (password && repeatedPassword && showError) {
      if (e.target.value === repeatedPassword) {
        setShowError(false);
      }
    }
  };
  const handleRepeatedPasswordChange = e => {
    setRepeatedPassword(e.target.value);
    if (password && repeatedPassword && showError) {
      if (e.target.value === password) {
        setShowError(false);
      }
    }
  };
  const handleSubmit = e => {
    if (password === repeatedPassword) {
      setShowError(false);
      props.onChangePassword(password, repeatedPassword);
      handleClose()
      props.signOut()
    } else {
      setShowError(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Zmiana hasła</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Wpisz nowe hasło, majace minimum 7 znaków i różniące się od
          aktualnego. Po zatwierdzeniu nastąpi wylogowanie.
        </DialogContentText>
        {showError && (
          <Typography variant="caption" style={{ color: "#c30000" }}>
            Podane hasła nie są takie same
          </Typography>
        )}
        <TextField
          value={password}
          onChange={handlePasswordChange}
          autoFocus
          margin="dense"
          label="Hasło"
          type="password"
          fullWidth
        />
        <TextField
          value={repeatedPassword}
          onChange={handleRepeatedPasswordChange}
          margin="dense"
          label="Powtórz hasło"
          type="password"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Anuluj
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={
            password.length <= 0 || repeatedPassword.length <= 0 || showError
          }
        >
          Zatwierdź
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePassword: (password, repeatedPassword) =>
      dispatch(changePassword(password, repeatedPassword)),
    signOut: () => dispatch(signOut())
  };
};

export default connect(null, mapDispatchToProps)(ChangePasswordModal);
