import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { uiPaths } from "utils/definitions";

const AttributeBox = props => {
  return (
    <Grid item container direction="row" justify="center" alignItems="center">
      <Grid item xs={7}>
        <Typography variant="h6" style={{ fontSize: '1.1rem' }}>
          {props.attributeName} {"  "}
          <img alt="attr" src={uiPaths[props.attribute]} style={{ height: '1.4rem', verticalAlign: 'bottom' }} />
        </Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center' }}>
        <Button
          style={{ minWidth: '32px', fontSize: '1.4rem', padding: '0 1rem' }}
          variant="contained"
          color="secondary"
          onClick={e => props.handleChange(e, props.attribute, -1)}
        >
          -
        </Button>
      </Grid>
      <Grid item xs={1} style={{ textAlign: 'center' }}>
        <Typography variant="h6" style={{ textAlign: 'center' }}>{props.values[props.attribute]}</Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center' }}>
        <Button
          style={{ minWidth: '32px', fontSize: '1.4rem', padding: '0 1rem' }}
          variant="contained"
          color="primary"
          onClick={e => props.handleChange(e, props.attribute, +1)}>+</Button>
      </Grid>
    </Grid>
  );
};

export default AttributeBox;