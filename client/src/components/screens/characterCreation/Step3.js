import React from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from "@material-ui/core/Typography";

const Step3 = (props) => {

 
  return (
    <React.Fragment>
    <Typography variant="h6">Wybierz klasę swojej postaci</Typography>
    <FormControl component="fieldset" >
        <FormLabel component="legend">Klasa</FormLabel>
        <RadioGroup aria-label="class" name="class" value={props.value} onChange={props.handleChange}>
          <FormControlLabel value="warrior" control={<Radio />} label="Wojownik" />
          <FormControlLabel value="mage" control={<Radio />} label="Mag" />
          <FormControlLabel value="rogue" control={<Radio />} label="Łotrzyk" />
          <FormControlLabel value="cleric" control={<Radio />} label="Kleryk" />
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default Step3;