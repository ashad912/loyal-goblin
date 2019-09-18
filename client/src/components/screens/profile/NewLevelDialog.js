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

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1
  },
  attribute: props => ({
    background: props.selected ? "blue" : "",
    color: props.selected ? "white" : ""
  })
}));

const NewLevelDialog = props => {
  const classes = useStyles();

  const [value, setValue] = React.useState('');


  function handleChange(event) {
    setValue(event.target.value);
  }


  const handleClose = () => {
    props.handleAddAndClose(value)
  }

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Nowy poziom!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Gratulacje nabicia {props.newLevel} levela, ziomeczku.
        </DialogContentText>

        <FormControl component="fieldset" >
        <FormLabel component="legend">Teraz czas wybrać, który atrybut rozwijasz:</FormLabel>
        <RadioGroup  name="attribute-choice" value={value} onChange={handleChange}>
          <FormControlLabel value="str" control={<Radio />} label="Siła" />
          <FormControlLabel value="dex" control={<Radio />} label="Zręczność" />
          <FormControlLabel value="mag" control={<Radio />} label="Magia" />
          <FormControlLabel value="end" control={<Radio />} label="Wytrzymałość" />
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
