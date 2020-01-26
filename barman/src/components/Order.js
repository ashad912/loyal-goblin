import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";

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
import ConnectionSpinnerDialog from "../layout/ConnectionSpinnerDialog";
import {itemsPath, usersPath} from '../utils/definitions'
import { createAvatarPlaceholder } from "../utils/methods";
import {OrderContext} from '../App'

const Order = props => {
  const history = useHistory();

  const { order, timer, finalizeOrder } = React.useContext(
    OrderContext
  );


  // const handleCancelOrder = async () => {
  //   history.push("/");
  // }


  let content = null;
  if (order.length>0) {
    content = (
      <React.Fragment>

      <Paper style={{ width: "90%", paddingTop: '1rem', margin: '1rem auto' }}>
        <Typography variant="h5" style={{marginBottom: '1rem'}}>Zweryfikuj to zamówienie:</Typography>
       
  <Typography variant="h6" style={{width: '100%', marginBottom: '1rem', color: 'rgb(184, 47, 47)'}}>{timer}</Typography>
        <Divider />
        <List component="nav" style={{ width: "100%" }}>
          {order.map(basket => {
            if(basket.price || basket.experience){

              return (
                <React.Fragment key={basket.profile._id}>
                  <ListItem style={{ flexDirection: "column"}}>
                    <List style={{ width: "100%" }}>
                      <ListItem>
                        <ListItemAvatar>
                          {basket.profile.avatar ? <img src={usersPath + basket.profile.avatar} style={{width: '3rem'}}/> : 
                          <Avatar style={{width: '3rem', height: '3rem'}}>{createAvatarPlaceholder(basket.profile.name)}</Avatar>}
                        </ListItemAvatar>
                        <ListItemText primary={basket.profile.name} />
                        <ListItemText
                          secondary={basket.price.toFixed(2) + " ZŁ"}
                        />
                      </ListItem>
                    </List>
                    <List style={{ paddingLeft: "2rem" }}>
                      <ListItem>
                        <ListItemText
                          primary={"Doświadczenie: " + basket.experience + " punktów"}
                        />
                      </ListItem>
                      {basket.awards.map(award => {
                        return (
                          <ListItem key={award._id}>
                            <ListItemIcon>
                              <img
                                src={itemsPath + award.itemModel.imgSrc}
                                width="32"
                              />
                            </ListItemIcon>
                            <ListItemText primary={award.itemModel.name} secondary={award.quantity > 1 && `x${award.quantity}`}/>
                          </ListItem>
                        );
                      })}
                    </List>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            }
          })}
        </List>
      </Paper>
      <Button style={{marginTop: '1rem'}} variant="contained" color="primary" onClick={finalizeOrder}>Zatwierdź zamówienie</Button>
      </React.Fragment>
    );
  } else {
    content = <div>Zamówienie wygasło</div>;
  }

  return (
    <div style={{width: '100%', textAlign: 'center'}}>
<Button style={{marginTop: '1.5rem'}} variant="contained" onClick={() => history.push('')}>{"< Menu"}</Button>
      {content}
    </div>
  );
};

export default Order;
