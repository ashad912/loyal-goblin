import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const AttributeBox = props => {
  return (
    <Grid item container direction="row" justify="center" alignItems="center">
      <Grid item xs={5}>
        <Typography variant="h6">{props.attributeName}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          color="secondary"
          onClick={e => props.handleChange(e, props.attribute, -1)}
        >
          -
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="h6">{props.values[props.attribute]}</Typography>
      </Grid>
      <Button item xs={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={e => props.handleChange(e, props.attribute, +1)}
        >
          +
        </Button>
      </Button>
    </Grid>
  );
};

export default AttributeBox;