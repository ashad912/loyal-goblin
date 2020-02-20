import React, { useState, useEffect, useCallback } from "react";
import _ from 'lodash'
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

import { getBarmans, registerBarman, changeBarmanPassword, deleteBarman } from "../../store/actions/barmanActions";

let currentBarman = null;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, password, confirmPassword, formErrors]);

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

  const validateForm = useCallback(
    //Need to pass any external values to function (e.g. password for confirmPassword validation), if no values are in the dependencies array.
    //Values in dependencies array force an update of the function, and this makes the debounce repeat.
    _.debounce((value, field, password) => {
     // console.log('debounce')
     // console.log(password)
      const errors = { ...formErrors };
      if (value.length > 0) {
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
              errors.confirmPassword = "Powtórzone hasło jest nieprawidłowe";
            }
            break;
  
          default:
            break;
        }
      } 
  
      setFormErrors(errors);
    }, 500), []
  )

  const preSubmitValidate = (isChangePassword) => {
    const errors = {...formErrors}
    if(userName.length <= 0 && !isChangePassword){
      errors.userName = "Uzupełnij to pole"
    }
    if(password.length <= 0){
      errors.password = "Uzupełnij to pole"
    }
    if(confirmPassword.length <= 0){
      errors.confirmPassword = "Uzupełnij to pole"
    }
    setFormErrors(errors)
    if(Object.values(errors).some(error => error !== null)){
      return false
    }else{
      return true
    }

  }

  const handleAddNewBarman = async () => {
    if(preSubmitValidate){

      if(password === confirmPassword){
        await registerBarman(userName, password, confirmPassword)
      }
      fetchBarmans()
      handleToggleDialog();
    }
  };

  const handleToggleDialog = () => {
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setNewBarmanDialogOpen(prev => !prev);
  };

  const handleChangeUserName = e => {
    setUserName(e.target.value);
   
  };

  const handleChangePassword = e => {
    setPassword(e.target.value);

  };

  const handleChangeConfirmPassword = e => {
    setConfirmPassword(e.target.value);
  };



  const handleTogglePasswordDialog = (id) => {
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    currentBarman = typeof(id) === 'string' ? id : null
    setShowPasswordDialog(prev=>!prev)
  }
  const handleSubmitNewPassword = async () => {
    if(preSubmitValidate(true)){

      if(password === confirmPassword && currentBarman){
        await changeBarmanPassword(currentBarman, password, confirmPassword)
      }
      handleTogglePasswordDialog()
    }
  }

  const handleToggleDeleteDialog = id => {

    currentBarman = typeof(id) === 'string' ? id : null
      setShowDeleteDialog(prev=>!prev)

  }

  const handleDeleteBarman = async () => {
    await deleteBarman(currentBarman)
    fetchBarmans()
    handleToggleDeleteDialog()
  }

  const barmanToDelete = barmans.find(barman => barman._id === currentBarman) && barmans.find(barman => barman._id === currentBarman).userName

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleToggleDialog}>
        Dodaj konto barmańskie
      </Button>
      {barmans.length > 0 && 
      
      <List
        style={{ width: "90%", margin: "3rem auto", border: "1px solid grey" }}
      >
        {barmans.reverse().map(barman => {
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
            onKeyUp={(e)=>validateForm(e.target.value, "userName")}
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
            onKeyUp={(e)=>validateForm(e.target.value, "password")}
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
            onKeyUp={(e)=>validateForm(e.target.value, "confirmPassword", password)}
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

      
      <Dialog
        open={showPasswordDialog}
        onClose={handleTogglePasswordDialog}
        PaperProps={{style:{padding: '2rem'}}}
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
            onKeyUp={(e)=>validateForm(e.target.value, "password")}
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
            onKeyUp={(e)=>validateForm(e.target.value, "confirmPassword", password)}
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
      

      
      <Dialog
        open={showDeleteDialog}
        onClose={handleToggleDeleteDialog}
        PaperProps={{style: {padding: '2rem'}}}
      >
        <DialogTitle >Usuń barmana {barmanToDelete}</DialogTitle>
          <DialogContent style={{paddingBottom: '1rem'}}>
            <Typography>
              Czy na pewno chcesz usunąć barmana {barmanToDelete}?
            </Typography>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDeleteDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={ handleDeleteBarman} color="primary" variant="contained" >
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};

export default AdminBarmans;
