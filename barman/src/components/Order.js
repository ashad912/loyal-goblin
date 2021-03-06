import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { itemsPath, usersPath } from "../utils/definitions";
import { createAvatarPlaceholder } from "../utils/methods";
import { OrderContext } from "../App";

const Order = props => {
  const history = useHistory();
  const [timer, setTimer] = useState('')
  const { order, finalizeOrder, orderFinalized, redirect, orderError, handleEndOrder, loading } = React.useContext(OrderContext);

  // const handleCancelOrder = async () => {
  //   history.push("/");
  // }
  let total = 0;
  if (order && order.length) {
    if (order.length > 1) {
      total = order.reduce((a, b) => a.price + b.price);
    } else {
      total = order[0].price;
    }
  }

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

  useEffect(() => {
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

  useEffect(() => {
    if(redirect){
      history.push('')
    }
  }, [redirect])


  let content = null;
  if (order.length > 0) {
    content = (
      <React.Fragment>
        <Button
        style={{borderRadius: 0}}
 
          variant="contained"
          fullWidth
          size="large"
          onClick={() => history.push('menu')}
        >
    {"< Wróć"}
    </Button>
        <Typography
          variant="h5"
          style={{ marginTop: "2rem", marginBottom: "1rem" }}
        >
          Zweryfikuj to zamówienie:
        </Typography>
        <Paper
          style={{ width: "90%", paddingTop: "1rem", margin: "1rem auto" }}
        >
          <Typography
            variant="h6"
            style={{
              width: "100%",
              marginBottom: "1rem",
              color: "rgb(184, 47, 47)"
            }}
          >
            {timer}
          </Typography>
          <Divider />
          <Typography style={{ fontWeight: "bolder", margin: "0.4rem 0" }}>
            Całkowity koszt zamówienia: {total && total.toFixed(2)} ZŁ
          </Typography>
          <Divider />
          <List component="nav" style={{ width: "100%" }}>
            {order.map(basket => {
              if (basket.products.length > 0 ) {
                return (
                  <React.Fragment key={basket.profile._id}>
                    <ListItem style={{ flexDirection: "column" }}>
                      <List style={{ width: "100%" }}>
                        <ListItem>
                          <ListItemAvatar>
                            {basket.profile.avatar ? (
                              <img
                                src={usersPath + basket.profile.avatar}
                                style={{ width: "3rem" }}
                              />
                            ) : (
                              <Avatar style={{ width: "3rem", height: "3rem" }}>
                                {createAvatarPlaceholder(basket.profile.name)}
                              </Avatar>
                            )}
                          </ListItemAvatar>
                          <Grid container justify="space-around">
                            <Grid item xs={6}>
                              <Typography>{basket.profile.name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="h5"
                                style={{ textAlign: "right" }}
                              >
                                {basket.price.toFixed(2) + " ZŁ"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ width: "100%" }}>
                              <Typography
                                variant="h6"
                                style={{ width: "100%", textAlign: "right" }}
                              >
                                {basket.experience + " PD"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </ListItem>
                      </List>
                      <List style={{ paddingLeft: "2rem" }}>
                        {basket.awards.map(award => {
                          return (
                            <ListItem key={award._id}>
                              <ListItemIcon>
                                <img
                                  src={itemsPath + award.itemModel.imgSrc}
                                  width="32"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={award.itemModel.name}
                                secondary={
                                  award.quantity > 1 && `x${award.quantity}`
                                }
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                      <Paper
                        style={{
                          width: "90%",
                          padding: "0.6rem",
                          boxSizing: "border-box"
                        }}
                        elevation={3}
                      >
                        <List>
                          {basket.products.map(product => {
                            const quantity =
                              product.quantity > 1
                                ? product.quantity + "x "
                                : "";
                            const totalPrice =
                              product.quantity * product.product.price;
                            return (
                              <ListItem
                              key={product._id}
                                style={{
                                  borderTop: "1px solid grey",
                                  borderBottom: "1px solid grey",
                                  margin: "0.2rem 0"
                                }}
                              >
                                <Grid container justify="space-between">
                                  <Grid item xs={9}>
                                    <Typography>
                                      {quantity + product.product.name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3}>
                                    {totalPrice.toFixed(2) + " ZŁ"}
                                  </Grid>
                                </Grid>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Paper>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              }
            })}
          </List>
        </Paper>
        {orderError ? 
      <Typography color="secondary" variant="h6" style={{margin: '1rem 0 2rem 0'}}>
        {orderError}
      </Typography>  :

        <Button
          style={{ margin: "1rem 0 2rem 0" }}
          variant="contained"
          color="primary"
          onClick={finalizeOrder}
        >
          Zatwierdź zamówienie
        </Button>
      }
      </React.Fragment>
    );
  } else {

    if(loading){
      content = null
    }else{

    content = <div>
      {orderFinalized ? <Typography variant="h5" style={{marginTop: '5rem'}} color="primary">Zamówienie zatwierdzone!</Typography> : <Typography variant="h5" style={{marginTop: '5rem'}} color="secondary">Zamówienie wygasło!</Typography>}
      <Typography variant="caption">Za chwilę nastąpi powrót do ekranu skanowania...</Typography>

    </div>
    }

  }

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {content}
    </div>
  );
};

export default Order;
