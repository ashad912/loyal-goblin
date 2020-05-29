import React from "react";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider'

import { PintoSerifTypography, PintoTypography } from "utils/fonts";
import { uiPaths, palette } from "utils/definitions";


const Step3 = (props) => {



  return (
    <React.Fragment >
      <img alt="class" src={uiPaths[props.value]} style={{height: '22vh'}}/>
    <PintoSerifTypography variant="h6" style={{fontSize: '1.4rem',textAlign: 'center', marginTop: '2rem'}}>Wybierz klasę postaci</PintoSerifTypography>
    <Divider style={{width: '90%', margin: '0.5rem 0'}}/>
    <FormControl component="fieldset" style={{padding: '0 0.5rem', marginBottom: '20vh', zIndex: 1}}>
        <RadioGroup aria-label="class" name="class" value={props.value} onChange={props.handleChange}>
          <FormControlLabel value="warrior" control={<Radio color="primary"/>} label="Wojownik [+1 Siły]" />
          <FormControlLabel value="rogue" control={<Radio color="primary"/>} label="Łotrzyk [+1 Zręczności]" />
          <FormControlLabel value="mage" control={<Radio color="primary"/>} label="Mag [+1 Magii]" />
          <FormControlLabel value="cleric" control={<Radio color="primary"/>} label="Kleryk [+1 Wytrzymałości]" />
        </RadioGroup>
      </FormControl>
      {/* <PintoTypography variant="caption" style={{fontSize: '1.2rem', textAlign: 'center', marginTop: '2rem', padding: '0 2rem', color: palette.background.darkGrey}}>
        Klasa postaci pozwala zakładać przedmioty przeznaczone dla danej klasy oraz daje premię do odpowiedniego atrybutu.
      </PintoTypography> */}
      <img alt="classBg" src={uiPaths[props.value+'Bg']} style={{width: '100%', position: 'absolute', bottom: -props.stepperHeight+'px', left: '0'}}/>
    </React.Fragment>
  );
};

export default Step3;