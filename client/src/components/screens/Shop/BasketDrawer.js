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
`

const FinalizeButton = styled(Button)`
width: 100%;
margin-top: 2rem;

`


const BasketDrawer = ({ open, toggle, baskets, mockUsers }) => {
let totalPrice = 0.0
  return (
    <Drawer open={open} onClose={toggle}>
      <DrawerContents>
        <Typography variant="h6">Zamówienie</Typography>
        <Divider />
        <List component="nav" style={{ width: "75vw" }}>
          {Object.keys(baskets).map(user => {
            const userName = mockUsers.find(
              mockUser => mockUser.id === Number(user)
            ).name;
            let summedPrice = 0.0;
            if (baskets[user].length === 1) {
              summedPrice = parseFloat(baskets[user][0].price);
              totalPrice += summedPrice
            } else if (baskets[user].length > 1) {
              summedPrice = baskets[user]
                .map(product => parseFloat(product.price))
                .reduce((a, b) => a + b);
                totalPrice += summedPrice
            }

            const userBasket = baskets[user];
            return (
              <BasketListItem
                key={user}
                name={userName}
                summedPrice={summedPrice.toFixed(2)}
                basket={userBasket}
              />
            );
          })}
        </List>
        <Divider />
        <TotalPriceText variant="body1" >Całkowity koszt zamówienia: {totalPrice.toFixed(2) + " ZŁ"}</TotalPriceText>
        <FinalizeButton variant="contained" color="primary" >Zrealizuj</FinalizeButton>
      </DrawerContents>
    </Drawer>
  );
};

export default BasketDrawer;
