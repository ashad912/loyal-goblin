import React from "react";
import _ from 'lodash'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const BasketListItem = ({name, summedPrice, basket}) => {
  const [open, setOpen] = React.useState(false);


  const handleToggleOpen = () => {
    setOpen(prev => !prev)
  }

 const basketCountedProducts = basket.map(product => {
      return {...product, count: basket.filter((p) => (p === product)).length}
  })

const basketUniqueItemsOnly = _.uniqBy(basketCountedProducts, "id")

 
  return (
    <div onClick={handleToggleOpen}>
      <ListItem>
          <ListItemText primary={name} style={{flexBasis: '50%'}}/>
          <ListItemText secondary={summedPrice + " ZŁ"} style={{flexBasis: '10%'}}/>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {basketUniqueItemsOnly.map(product => {
            return (
              <ListItem key={product.id} style={{ paddingLeft: "2rem" }}>
                <ListItemText secondary={product.title} style={{flexBasis: '30%'}} />
                <ListItemText secondary={product.count+"x"}  style={{flexBasis: '10%'}}/>
                <ListItemText secondary={product.price + " ZŁ"} style={{flexBasis: '30%'}}/>
                {product.count > 1 && 
                
                <ListItemText secondary={"= " + (product.count * product.price).toFixed(2) + " ZŁ"} style={{flexBasis: '30%'}}/>}
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </div>
  );
};

export default BasketListItem;
