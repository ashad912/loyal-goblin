import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider'

const Step1 = props => {
  return (
    <React.Fragment>
      <Typography variant="h6">Podaj imię swojej postaci</Typography>
      <Divider style={{width: '90%'}}/>
      <TextField
      type=""
        label="Na przykład Janusz"
        value={props.value}
        onChange={props.handleChange}
        margin="normal"
      />
    </React.Fragment>
  );
};

export default Step1;