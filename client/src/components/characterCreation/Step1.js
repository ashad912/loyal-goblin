import React from "react";
import TextField from "@material-ui/core/TextField";
import { PintoSerifTypography, PintoTypography } from "../../assets/fonts";
import { palette } from "../../utils/constants";


const Step1 = props => {


  const handleCheck = e => {
    props.handleCheck(e.target.value)
  }

  return (
    <React.Fragment>
      <PintoSerifTypography variant="h6" style={{fontSize: '1.4rem', marginBottom: '2rem', textAlign: 'center'}}>Wybierz imię dla postaci</PintoSerifTypography>

      <TextField
      type="text"
      fullWidth
        inputProps={{style: {textAlign:'center', fontSize: '1.4rem'}}}
        value={props.value}
        onChange={props.handleChange}
        margin="normal"
        onKeyUp={handleCheck}
        error={props.nameTaken}
        helperText={props.nameTaken && "Podane imię jest już w użyciu."}
      />

<PintoTypography style={{fontSize: '1.2rem', textAlign: 'center', marginTop: '2rem', padding: '0 2rem', color: palette.background.darkGrey}}>
        Imię może składać się z liter polskiego alfabetu, cyfr, dwóch słów i maksymalnie 20 znaków. Wielkość liter nie ma znaczenia.
      </PintoTypography>

    </React.Fragment>
  );
};

export default Step1;