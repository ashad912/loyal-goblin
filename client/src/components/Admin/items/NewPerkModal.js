import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";


const perkTypes = [
  "attr-strength",
  "attr-dexterity",
  "attr-magic",
  "attr-endurance",
  "experience",
  "disc-product",
  "disc-category",
  "disc-rent"
];

class NewPerkModal extends React.Component {

  state = {
    perk:{
      perkType: undefined,
      value: undefined,
      name: undefined,
      time: [/*day, startHour, lengthInHours*/],
    }
    
  }

  handleAdd = id => () => {
    this.props.handleAddAmulet(id);
  };

  handleSubtract = id => () => {
    this.props.handleSubtractAmulet(id);
  };

  handleDelete = id => () => {
    this.props.handleDeleteAmulet(id);
  };

  handleChangeQuantity = (e, id) => {
    this.props.handleChangeAmuletQuantity(e, id);
  };

  handleCheckbox = (id, quantity) => () => {
    if (quantity > 0) {
        this.props.handleDeleteAmulet(id);
    } else {
        this.props.handleAddAmulet(id);
    }
  };

  handleChangePerkNameValue = (e) => {
    const name = e.target.name
    const value = e.target.value 
    this.setState({
      perk:{
        ...this.state.perk,
        [name]: value
      }     
    })
  };

  render(){
  return (
    <div>
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Efekt przedmiotu</DialogTitle>
        <DialogContent>
          <FormControl >
            <InputLabel htmlFor="perkType">Typ</InputLabel>
            <Select
              autoFocus
                value={this.state.perk.perkType}
                onChange={this.handleChangePerkNameValue}
                inputProps={{
                    name: 'perkType',
                    id: 'perkType',
                }}
            >
                {perkTypes.map((perkType) => {
                    return (
                        <MenuItem value={perkType}>{perkType}</MenuItem>
                    )
                })}
            </Select>
          </FormControl>
          <FormControl >
            <TextField
              
              name="value"
              margin="dense"
              label={`Modyfikator efektu`}
              type="text"
              fullWidth
              onChange={this.handleChangePerkNameValue}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
}

export default NewPerkModal;
