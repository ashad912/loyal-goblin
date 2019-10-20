import React from "react";
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

const mockBarmans = [
  { firstName: "A", lastName: "B", nickname: "abab" },
  { firstName: "Ccc", lastName: "Ddd", nickname: "dcdcdcd" },
  { firstName: "Eeee", lastName: "Fffff", nickname: "efefefe" }
];

const AdminBarmans = () => {
  const [newBarmanDialogOpen, setNewBarmanDialogOpen] = React.useState(false);

  const handleAddNewBarman = () => {
    handleToggleDialog();
  };

  const handleToggleDialog = () => {
    setNewBarmanDialogOpen(prev => !prev);
  };
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleToggleDialog}>
        Dodaj konto barmańskie
      </Button>
      <List style={{width: '50%', margin: '3rem auto', border: '1px solid grey'}}>
        {mockBarmans.map(barman => {
          return (
            <ListItem>
              <ListItemText
                primary={barman.firstName + " " + barman.lastName}
                secondary={barman.nickname}
              />
              <ListItemSecondaryAction>
                <Button color = "primary">Edytuj</Button>
                <Button color="secondary">Usuń</Button>
              </ListItemSecondaryAction>

            </ListItem>
          );
        })}
      </List>
      <Dialog open={newBarmanDialogOpen} onClose={handleToggleDialog}>
        <DialogTitle>Skonfiguruj nowe konto barmańskie</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <TextField label="Imię" type="text" />
          <TextField label="Nazwisko" type="text" />
          <TextField label="Ksywka" type="text" />
          <TextField label="Email" type="email" autoComplete="off" />
          <TextField
            label="Hasło"
            type="password"
            autoComplete="new-password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={handleAddNewBarman} color="primary">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminBarmans;
