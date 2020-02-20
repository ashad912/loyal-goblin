import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const Attribute = props => {
  let fontColor = "inherit";
  if (props.attributeModifier > 0) {
    fontColor = "rgb(68, 192, 0)";
  } else if (props.attributeModifier < 0) {
    fontColor = "rgb(178, 34, 34)";
  }

  return (
    <Box style={{ width: "100%" }}>
      <Grid container directon="column" >
        <Grid item container direction="column" xs={6} >
          <Grid item>
            <img
              src={props.attributeIcon}
              style={{ width: "2rem", paddingTop: "0.4rem" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption">{props.attributeName}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={6} >
          <Typography variant="h3" style={{color: fontColor}}>
            {props.attributeValue + props.attributeModifier}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Attribute;
