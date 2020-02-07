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
            key={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            priceModified={item.hasOwnProperty('priceModified') && item.priceModified}
            experience={item.experience ? item.experience : item.price * 10}
            experienceModified={  item.experienceModified}
            imgSrc={item.imgSrc}
            id={item._id}
            handleAddItem={handleAddItem}
            awards={item.hasOwnProperty('awards') && item.awards}
          />
        );
      })}
    </List>
  );
};

export default ShopList;
