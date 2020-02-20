import React from "react";
import {useHistory} from 'react-router'
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { OrderContext } from "../App";

const Menu = props => {
  const history = useHistory()
  const [timer, setTimer] = React.useState('')
  const { order, handleEndOrder } = React.useContext(
    OrderContext
  );

  React.useEffect(() => {
    if (order.length > 0) {
      calculateTimeLeft();
      const orderTimeout = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
      return () => {
        clearInterval(orderTimeout);
      };
    }
  }, [order]);



  const calculateTimeLeft = () => {
    if (order.length > 0) {
      const utcDateNow = moment.utc(new Date());
      const orderTimeMax = moment(order[0].createdAt);
      const difference = orderTimeMax.diff(utcDateNow);
      if (difference > 0) {
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const formatted = moment(`${minutes}:${seconds}`, "mm:ss").format(
          "mm:ss"
        );
        setTimer(`Zamówienie wygaśnie za ${formatted}`);
      } else {
        handleEndOrder();
      }
    } else {
      handleEndOrder();
    }
  };

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
      <Grid item>

              <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => history.push('settings')}
        >
          Ustawienia
        </Button>
      </Grid>
    </Grid>
  );
};

export default Menu;
