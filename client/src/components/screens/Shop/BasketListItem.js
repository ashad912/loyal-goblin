import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const BasketListItem = ({activeUsersBasket, name, summedPrice, basket, handleRemoveItem, noParty}) => {
  const [open, setOpen] = React.useState(false);


  const handleToggleOpen = () => {
    setOpen(prev => !prev)
  }


  const removeItem = (e, id) => {
    e.stopPropagation()
    handleRemoveItem(id)
  }

 
  return (
    <div>

      {noParty ? 
        <div >
  
        
          <List component="div" disablePadding>
            {basket.map(product => {
              return (
                <ListItem key={product.id} style={{ paddingLeft: "2rem" }}>
                  {activeUsersBasket && 
                  <DeleteForeverIcon style={{width: '2rem', height: '2rem', color: "#b40000"}} onClick={(e) => removeItem(e, product.id)}/>
                  }
                  <ListItemText secondary={product.name} style={{flexBasis: '30%'}} />
                  <ListItemText secondary={product.quantity+"x"}  style={{flexBasis: '10%'}}/>
                  <ListItemText secondary={product.price.toFixed(2) + " ZŁ"} style={{flexBasis: '30%'}}/>
                  <ListItemText secondary={"= " + (product.quantity * product.price).toFixed(2) + " ZŁ"} style={{flexBasis: '30%'}}/>
                </ListItem>
              );
            })}
          </List>
  
      </div>
      :
  
      <div onClick={handleToggleOpen}>
        <ListItem>
            <ListItemText primary={name} style={{flexBasis: '50%'}}/>
            <ListItemText secondary={summedPrice + " ZŁ"} style={{flexBasis: '10%'}}/>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {basket.map(product => {
              return (
                <ListItem key={product.id} style={{ paddingLeft: "2rem" }}>
                  {activeUsersBasket && 
                  <DeleteForeverIcon style={{width: '2rem', height: '2rem', color: "#b40000"}} onClick={(e) => removeItem(e, product.id)}/>
                  }
                  <ListItemText secondary={product.name} style={{flexBasis: '30%'}} />
                  <ListItemText secondary={product.quantity+"x"}  style={{flexBasis: '10%'}}/>
                  <ListItemText secondary={product.price.toFixed(2) + " ZŁ"} style={{flexBasis: '30%'}}/>
                  <ListItemText secondary={"= " + (product.quantity * product.price).toFixed(2) + " ZŁ"} style={{flexBasis: '30%'}}/>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </div>
      }
    </div>
  );
};

export default BasketListItem;
