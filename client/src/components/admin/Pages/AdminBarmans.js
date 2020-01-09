import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ListItem from "@material-ui/core/ListItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import { getBarmans, registerBarman, changeBarmanPassword, deleteBarman } from "../../../store/adminActions/barmanActions";

const AdminBarmans = () => {
  const [barmans, setBarmans] = useState([]);
  const [newBarmanDialogOpen, setNewBarmanDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    userName: null,
    password: null,
    confirmPassword: null
  });
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [currentBarman, setCurrentBarman] = useState(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const fetchBarmans = async () => {
    const barmans = await getBarmans();
    setBarmans(barmans);
  };

  useEffect(() => {
    fetchBarmans();
  }, []);

  useEffect(() => {
    checkDisableSubmit();
  }, [userName, password, confirmPassword]);

  const checkDisableSubmit = () => {
    let disable = true;
    if (userName.trim() && password && confirmPassword) {
      if (
        !formErrors.password &&
        !formErrors.confirmPassword &&
        !formErrors.userName
      ) {
        
          disable = false;
       
      }
    }
    if(showPasswordDialog && password && confirmPassword){
      if (
        !formErrors.password &&
        !formErrors.confirmPassword
      ){
        disable= false
      }
    }
    setDisableSubmit(disable);
  };

  const validateForm = (field, value) => {
    const errors = { ...formErrors };
    if (value.length) {
      switch (field) {
        case "userName":
          errors.userName = null;
          if (value.trim().length <= 0) {
            errors.userName = "Wpisz nazwę użytkownika";
          }
          break;
        case "password":
          errors.password = null;
          if (value.length < 7) {
            errors.password = "Hasło musi składać się z minimum 7 znaków";
          }
          break;
        case "confirmPassword":
          errors.confirmPassword = null;
          if (value !== password) {
            errors.confirmPassword = "Potwórzone hasło jest nieprawidłowe";
          }
          break;

        default:
          break;
      }
    } else {
      errors[field] = "Uzupełnij to pole";
    }

    setFormErrors(errors);
  };

  const handleAddNewBarman = async () => {
    if(password === confirmPassword){
      await registerBarman(userName, password, confirmPassword)
    }
    fetchBarmans()
    handleToggleDialog();
  };

  const handleToggleDialog = () => {
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setNewBarmanDialogOpen(prev => !prev);
  };

  const handleChangeUserName = e => {
    setUserName(e.target.value);
    validateForm("userName", e.target.value);
  };

  const handleChangePassword = e => {
    setPassword(e.target.value);
    validateForm("password", e.target.value);
  };

  const handleChangeConfirmPassword = e => {
    setConfirmPassword(e.target.value);
    validateForm("confirmPassword", e.target.value);
  };

  const handleTogglePasswordDialog = (id) => {
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setCurrentBarman(id)
    setShowPasswordDialog(prev=>!prev)
  }
  const handleSubmitNewPassword = async () => {
    if(password === confirmPassword && currentBarman){
      await changeBarmanPassword(currentBarman, password, confirmPassword)
    }
    handleTogglePasswordDialog()
  }

  const handleToggleDeleteDialog = id => {
    setCurrentBarman(id)
    setShowDeleteDialog(prev=>!prev)
  }

  const handleDeleteBarman = async () => {
    await deleteBarman(currentBarman)
    fetchBarmans()
    handleToggleDeleteDialog()
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleToggleDialog}>
        Dodaj konto barmańskie
      </Button>
      {barmans.length > 0 && 
      
      <List
        style={{ width: "50%", margin: "3rem auto", border: "1px solid grey" }}
      >
        {barmans.map(barman => {
          return (
            <ListItem key={barman._id}>
              <ListItemText primary={barman.userName} />
              <ListItemSecondaryAction>
                <Button color="primary" onClick={(e)=>handleTogglePasswordDialog(barman._id)}>Zmiana hasła</Button>
                <Button color="secondary" onClick={(e)=>handleToggleDeleteDialog(barman._id)}>Usuń</Button>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      }
      <Dialog open={newBarmanDialogOpen} onClose={handleToggleDialog}>
        <DialogTitle>Skonfiguruj nowe konto barmańskie</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <TextField
          style={{marginBottom: '0.5rem'}}
          fullWidth
            value={userName}
            label="Nazwa użytkownika"
            type="text"
            onChange={handleChangeUserName}
            error={Boolean(formErrors.userName)}
            helperText={formErrors.userName}
          />
          <TextField
          style={{marginBottom: '0.5rem'}}
          fullWidth
            value={password}
            label="Hasło"
            type="password"
            inputProps={{autoComplete:"new-password"}}
            onChange={handleChangePassword}
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
          />
          <TextField
          style={{marginBottom: '0.5rem'}}
          fullWidth
            value={confirmPassword}
            label="Powtórz hasło"
            type="password"
            inputProps={{autoComplete:"new-password"}}
            onChange={handleChangeConfirmPassword}
            error={Boolean(formErrors.confirmPassword)}
            helperText={formErrors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDialog} color="secondary">
            Anuluj
          </Button>
          <Button
            onClick={handleAddNewBarman}
            color="primary"
            variant="contained"
            disabled={disableSubmit}
          >
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
      {currentBarman && 
      
      <Dialog
        open={showPasswordDialog}
        onClose={handleTogglePasswordDialog}
      >
        <DialogTitle >Zmień hasło konta barmańskiego</DialogTitle>
        <DialogContent>
        <TextField
        style={{marginBottom: '0.5rem'}}
        fullWidth
            value={password}
            label="Hasło"
            type="password"
            inputProps={{autoComplete:"new-password"}}
            onChange={handleChangePassword}
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
          />
          <TextField
          style={{marginBottom: '0.5rem'}}
          fullWidth
            value={confirmPassword}
            label="Powtórz hasło"
            type="password"
            inputProps={{autoComplete:"new-password"}}
            onChange={handleChangeConfirmPassword}
            error={Boolean(formErrors.confirmPassword)}
            helperText={formErrors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTogglePasswordDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={ handleSubmitNewPassword} color="primary" variant="contained" disabled={disableSubmit}>
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
      }
      {currentBarman && 
      
      <Dialog
        open={showDeleteDialog}
        onClose={handleToggleDeleteDialog}
      >
<DialogTitle >Usuń barmana {barmans.find(barman => barman._id === currentBarman).userName}</DialogTitle>
        
        <DialogActions>
          <Button onClick={handleToggleDeleteDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={ handleDeleteBarman} color="primary" variant="contained" >
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
      }
    </div>
  );
};

export default AdminBarmans;
