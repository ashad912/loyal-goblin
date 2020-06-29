import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider'

import {uiPaths} from 'utils/constants'
import { PintoSerifTypography } from "assets/fonts";

const Step5 = props => {
  let characterClass = props.characterClass;
  switch (characterClass) {
    case "warrior":
      characterClass = "Wojownik";
      break;
    case "rogue":
      characterClass = "Łotrzyk";
      break;
    case "mage":
      characterClass = "Mag";

      break;
    case "cleric":
      characterClass = "Kleryk";

      break;

    default:
      break;
  }

  return (
    <React.Fragment>
      <PintoSerifTypography variant="h4" style={{fontSize: '2rem',textAlign: 'center'}}>Podsumowanie</PintoSerifTypography>
      <Divider style={{width: '100%', margin: '0.5rem 0'}}/>
      <Typography variant="h6">
        {props.name}{" "}
        {props.sex === "female" ? (
          <img alt="sex" src={uiPaths.female} style={{height: '2rem', verticalAlign: 'bottom'}}/>
        ) : (
          <img alt="sex" src={uiPaths.male} style={{height: '2rem', verticalAlign: 'bottom'}}/>
        )}
      </Typography>

      <Typography variant="h6">{characterClass} {"  "}
      <img alt="class" src={uiPaths[props.characterClass]} style={{height: '2rem', verticalAlign: 'bottom'}}/>
      </Typography>
      <Grid
      style={{marginTop:'2rem'}}
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={8}>
            <Typography variant="h5">Siła</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h5" style={{textAlign:'right'}}>{props.attributes.strength}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5">Zręczność</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h5" style={{textAlign:'right'}}>{props.attributes.dexterity}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5">Magia</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h5" style={{textAlign:'right'}}>{props.attributes.magic}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5">Wytrzymałość</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h5" style={{textAlign:'right'}}>{props.attributes.endurance}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <img alt="classBg" src={uiPaths[props.characterClass+'Bg']} style={{width: '100%', position: 'absolute', bottom: '0', left: '0', opacity: '0.4'}}/>
    </React.Fragment>
  );
};

export default Step5;