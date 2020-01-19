import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



const NewLevelDialog = props => {

  const [value, setValue] = React.useState('');


  function handleChange(event) {
    setValue(event.target.value);
  }


  const handleClose = () => {
    props.confirmLevel(value)
    setValue('')
  }

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Nowy poziom!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Osiągnąłeś poziom {(props.userLevel - props.levelNotifications)+1}!
        </DialogContentText>

        <FormControl component="fieldset" >
        <FormLabel component="legend">Teraz czas wybrać, który atrybut rozwijasz:</FormLabel>
        <RadioGroup  name="attribute-choice" value={value} onChange={handleChange}>
          <FormControlLabel value="strength" control={<Radio />} label="Siła" />
          <FormControlLabel value="dexterity" control={<Radio />} label="Zręczność" />
          <FormControlLabel value="magic" control={<Radio />} label="Magia" />
          <FormControlLabel value="endurance" control={<Radio />} label="Wytrzymałość" />
        </RadioGroup>
      </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" disabled={value===''} color="primary">
          Zrobione!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewLevelDialog;
