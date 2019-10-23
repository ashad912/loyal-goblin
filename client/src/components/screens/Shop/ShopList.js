import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ShopListItem from "./ShopListItem";

const ShopList = ({title, list, handleAddItem}) => {
  return (
    <List>
      <ListItem>
        <Typography variant="h5">{title}</Typography>
      </ListItem>
      {list.map(item => {
        return (
          <ShopListItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imgSrc={item.imgSrc}
            id={item.id}
            handleAddItem={handleAddItem}
            prizes={item.hasOwnProperty('prizes') && item.prizes}
          />
        );
      })}
    </List>
  );
};

export default ShopList;
