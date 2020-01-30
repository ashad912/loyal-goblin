import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider'

const Step1 = props => {


  const handleCheck = e => {
    props.handleCheck(e.target.value)
  }

  return (
    <React.Fragment>
      <Typography variant="h6">Podaj imię swojej postaci</Typography>
      <Divider style={{width: '90%'}}/>
      <TextField
      type="text"
      fullWidth
        label="Na przykład Janusz"
        value={props.value}
        onChange={props.handleChange}
        margin="normal"
        onKeyUp={handleCheck}
        error={props.nameTaken}
        helperText={props.nameTaken && "Podane imię jest już w użyciu."}
      />

<Typography variant="caption" style={{textAlign: 'center', marginTop: '1rem'}}>
        Imię może składać się z liter polskiego alfabetu, cyfr, dwóch słów i maksymalnie 20 znaków.
      </Typography>

    </React.Fragment>
  );
};

export default Step1;