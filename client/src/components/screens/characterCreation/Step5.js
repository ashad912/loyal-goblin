import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {uiPaths} from '../../../utils/definitions'

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
      <Typography variant="h4">Podsumowanie</Typography>
      <Typography variant="h6">
        {props.name}{" "}
        {props.sex === "female" ? (
          <img src={uiPaths.female} style={{width: '1.2rem'}}/>
        ) : (
          <img src={uiPaths.male} style={{width: '1.2rem'}}/>
        )}
      </Typography>

      <Typography variant="h6">{characterClass}</Typography>
      <img src={uiPaths[props.characterClass]} style={{width: '2rem', marginBottom: '1rem'}}/>
      <Grid
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
            <Typography variant="h6">Siła</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h6">{props.attributes.strength}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">Zręczność</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h6">{props.attributes.dexterity}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">Magia</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h6">{props.attributes.magic}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6">Wytrzymałość</Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="h6">{props.attributes.endurance}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Step5;