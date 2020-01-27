import React from "react";
import {useHistory} from 'react-router'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { OrderContext } from "../App";

const Menu = props => {
  const history = useHistory()

  const { order, timer } = React.useContext(
    OrderContext
  );

  return (
    <Grid
      style={{ height: "100vh", width: "100%" }}
      container
      direction="column"
      alignItems="center"
      justify="space-around"
    >
      <Grid item>
        <Button
        color="primary"
          variant="contained"
          fullWidth
          size="large"
          onClick={() => history.push('')}
        >
          Skanuj kod
        </Button>
      </Grid>
      {order.length > 0 && 
      <Grid item>
        <Button variant="contained" color="primary" fullWidth size="large" onClick={() => history.push('order')}>
          Otwórz ostatnie zamówienie
        </Button>
        <Typography variant="h6" style={{width: '100%', margin: '1rem 0'}} color="secondary">{timer}</Typography>
      </Grid>
      }
    </Grid>
  );
};

export default Menu;
