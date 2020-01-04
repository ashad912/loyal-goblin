import React from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider'

const Step2 = (props) => {



  return (
    <React.Fragment>
    <Typography variant="h6">Wybierz płeć swojej postaci</Typography>
    <Divider style={{width: '90%'}}/>
    <FormControl component="fieldset" >
        <RadioGroup aria-label="gender" name="gender" value={props.value} onChange={props.handleChange}>
          <FormControlLabel value="female" control={<Radio />} label="Kobieta" />
          <FormControlLabel value="male" control={<Radio />} label="Mężczyzna" />
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default Step2;