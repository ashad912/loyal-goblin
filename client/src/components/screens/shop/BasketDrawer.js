import React from "react";
import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import BasketListItem from "./BasketListItem";

const DrawerContents = styled.div`
  padding: 1rem;
`;

const TotalPriceText = styled(Typography)`
  margin-top: 2rem;
  font-weight: bolder;
`;

const FinalizeButton = styled(Button)`
  width: 100%;
  margin-top: 2rem;
`;

const BasketDrawer = ({ open, toggle, baskets, users, activeUser, handleRemoveItem, finalizeOrder, leader, children }) => {

  let totalPrice = 0.0;
  const allBaskets = Object.values(baskets)
  let emptyOrder = true
  if(allBaskets.length > 0){
    emptyOrder = Object.values(baskets).reduce((a,b)=>a.concat(b)).length <= 0
  }
  let notLeader = true

  if(activeUser === leader){
    notLeader = false
  }


  return (
    <Drawer open={open} onClose={toggle} >
      <DrawerContents style={{maxWidth: '80vw'}}>
        <Typography variant="h6">Zamówienie</Typography>
        {!emptyOrder ? 
        <Divider />:
        <Typography style={{marginTop: '3rem', color: 'grey'}}>Brak produktów w koszyku</Typography>
        }
        <List component="nav" style={{ width: "75vw" }}>
          {Object.keys(baskets).map(user => {

            //const userName = users.length > 0 && users[0] && user.name 
            const userName = users.length > 1 ? users.find(u => u._id === user).name : users[0].name
            let summedPrice = 0.0;

            if (baskets[user].length > 0) {
              summedPrice = baskets[user]
                .map(product => product.price * product.quantity)
                .reduce((a, b) => a + b);
              totalPrice += summedPrice;
            }

            const userBasket = baskets[user];
            if (baskets[user].length > 0) {
              
              return (
                <BasketListItem
                noParty={users.length <= 1}
                  activeUsersBasket = {user === activeUser}
                  key={user}
                  name={userName}
                  summedPrice={summedPrice.toFixed(2)}
                  basket={userBasket}
                  handleRemoveItem = {handleRemoveItem}
                />
              );
            }
          })}
        </List>
        {!emptyOrder && 
        <Divider />
        }
        <TotalPriceText variant="body1">
          Całkowity koszt zamówienia: {totalPrice.toFixed(2) + " ZŁ"}
        </TotalPriceText>
        {!emptyOrder && 
        <FinalizeButton variant="contained" color="primary" disabled={emptyOrder || notLeader} onClick={finalizeOrder}>
          {notLeader ? 'Tylko lider może zrealizować zamówienie' : 'Zrealizuj'}
        </FinalizeButton>
        
        }
        {children}
      </DrawerContents>
    </Drawer>
  );
};

export default BasketDrawer;
