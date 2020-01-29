import React, {useState} from 'react'
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";

const ChangePasswordModal = (props) => {

    const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
const [showError, setShowError] = useState(false)



const handleOldPasswordChange = e => {
    setOldPassword(e.target.value);
  };

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
  const handleSubmit = async e => {
    if (password === repeatedPassword && oldPassword && password.length >= 7 && repeatedPassword.length >= 7) {
      setShowError(false);
     props.handleConfirm(oldPassword, password, repeatedPassword);
      handleClose()
      setOldPassword('')
      setPassword('')
      setRepeatedPassword('')
      props.handleLogout()
    } else {
      setShowError(true);
    }
  };


    const open = props.open
    const handleClose = props.handleClose



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
        {showError && (
          <Typography variant="caption" style={{ color: "#c30000" }}>
            Podane hasła nie są takie same
          </Typography>
        )}
        <TextField
          value={oldPassword}
          onChange={handleOldPasswordChange}
          autoFocus
          margin="dense"
          label="Aktualne hasło"
          type="password"
          fullWidth
        />
        <TextField
          value={password}
          onChange={handlePasswordChange}
          margin="dense"
          label="Nowe hasło"
          type="password"
          fullWidth
        />
        <TextField
          value={repeatedPassword}
          onChange={handleRepeatedPasswordChange}
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
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={
            password.length <= 0 || repeatedPassword.length <= 0 || showError
          }
        >
          Zatwierdź
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordModal
