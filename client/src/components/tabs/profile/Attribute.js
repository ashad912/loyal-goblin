import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { PintoTypography } from "utils/fonts";
import { palette } from "utils/definitions";


const Attribute = props => {
  let fontColor = "inherit";
  if (props.attributeModifier > 0) {
    fontColor = "rgb(68, 192, 0)";
  } else if (props.attributeModifier < 0) {
    fontColor = "rgb(178, 34, 34)";
  }

  return (
    <Box style={{ width: "100%" }}>
      <Grid container directon="row" justify="center" alignItems="flex-start" >
        <Grid item container direction="column" xs={8} style={{paddingRight:'0.4rem'}}>
          <Grid item style={{width:'100%', textAlign:'center'}}>
            <img
              src={props.attributeIcon}
              alt="attr"
              style={{ width: "2rem", paddingTop: "0.4rem" }}
            />
          </Grid>
          <Grid item style={{width:'100%', textAlign:'center'}}>
            <PintoTypography style={{color: palette.background.darkGrey}}>{props.attributeName}</PintoTypography>
          </Grid>
        </Grid>
        <Grid item xs={4} >
          <Typography variant="h4" style={{color: fontColor, textAlign:'center'}}>
            {props.attributeValue + props.attributeModifier}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Attribute;
