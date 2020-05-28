import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AttributeBox from "./AttributeBox";
import Divider from '@material-ui/core/Divider'
import { PintoSerifTypography, PintoTypography } from "../../utils/fonts";
import { palette } from "../../utils/definitions";


const Step4 = props => {
  return (
    <React.Fragment>
      <PintoSerifTypography variant="h6" style={{fontSize: '1.4rem',textAlign: 'center'}}>
        Rozdziel atrybuty postaci
      </PintoSerifTypography>
      <Divider style={{width: '100%'}}/>
      <Typography variant="body2" style={{margin: '1rem 0', color: palette.background.darkGrey}}>
        Dostępne punkty: <span style={{color: 'black'}}>{props.attributePool}/3</span>
      </Typography>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={3}
        wrap="nowrap"
      >
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="strength"
          attributeName="Siła"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="dexterity"
          attributeName="Zręczność"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="magic"
          attributeName="Magia"
        />
        <AttributeBox
          handleChange={props.handleChange}
          values={props.values}
          attributePool={props.attributePool}
          attribute="endurance"
          attributeName="Wytrzymałość"
        />
      </Grid>
      <PintoTypography style={{fontSize: '1.2rem', textAlign: 'center', marginTop: '2rem', padding: '0 2rem', color: palette.background.darkGrey}}>
        Atrybuty będą miały wpływ na dostępne dla Ciebie misje!
      </PintoTypography>
    </React.Fragment>
  );
};

export default Step4;