import React from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider'

const Step3 = (props) => {

 
  return (
    <React.Fragment>
    <Typography variant="h6">Wybierz klasę swojej postaci</Typography>
    <Divider style={{width: '90%'}}/>
    <FormControl component="fieldset" >
        <RadioGroup aria-label="class" name="class" value={props.value} onChange={props.handleChange}>
          <FormControlLabel value="warrior" control={<Radio />} label="Wojownik [+1 Siły]" />
          <FormControlLabel value="rogue" control={<Radio />} label="Łotrzyk [+1 Zręczności]" />
          <FormControlLabel value="mage" control={<Radio />} label="Mag [+1 Magii]" />
          <FormControlLabel value="cleric" control={<Radio />} label="Kleryk [+1 Wytrzymałości]" />
        </RadioGroup>
      </FormControl>
      <Typography variant="caption" style={{textAlign: 'center', marginTop: '1rem'}}>
        Klasa postaci pozwala zakładać przedmioty przeznaczone dla danej klasy oraz daje premię do odpowiedniego atrybutu.
      </Typography>
    </React.Fragment>
  );
};

export default Step3;