import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Drawer from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {PintoTypography} from 'assets/fonts'
import {uiPaths} from 'utils/constants'

const NewLevelDrawer = props => {

  const [value, setValue] = React.useState('');


  function handleChange(event) {
    setValue(event.target.value);
  }

  const handleClose = () => {
    props.confirmLevel(value)
    setValue('')
  }

  return (
   
      
      
    <Drawer anchor="left" open={props.open} onClose={props.handleClose} disableBackdropTransition={true} >
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '55vw', height: '100%', padding: '1rem 1.5rem'}}>
        <Typography variant="h4">Awans!</Typography>
      
        <PintoTypography style={{marginBottom: '1rem'}}>
          {props.levelNotifications > 0 && `Osiągnięto poziom ${(props.userLevel - props.levelNotifications)+1}`}
        </PintoTypography>

      <FormControl component="fieldset" style={{marginBottom: '1rem'}}>
        <RadioGroup  name="attribute-choice" value={value} onChange={handleChange} >
          <FormControlLabel value="strength" control={<Radio color="primary"/>} label={`+1 Siły`} />
          <FormControlLabel value="dexterity" control={<Radio color="primary"/>} label={`+1 Zręczności`} />
          <FormControlLabel value="magic" control={<Radio color="primary"/>} label={`+1 Magii`} />
          <FormControlLabel value="endurance" control={<Radio color="primary"/>} label={`+1 Wytrzymałości`} />
        </RadioGroup>
      </FormControl>
      
      
        <Button onClick={handleClose} variant="contained" disabled={value===''} color="primary" style={{width: '40%', alignSelf: 'center'}}>
          Zrobione!
        </Button>
        <img alt="levelBg" src={uiPaths['levelBg']} style={{width: '100%'}}/>
      </div>
    </Drawer>
  );
};

export default NewLevelDrawer;