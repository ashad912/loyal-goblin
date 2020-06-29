import React from "react";

import { ListItemAvatar } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { uiPaths, palette } from "utils/constants";
import { PintoTypography } from "assets/fonts";


const BasketListItem = ({activeUsersBasket, name, summedPrice, basket, handleRemoveItem, noParty}) => {
  const [open, setOpen] = React.useState(false);

 

  const handleToggleOpen = () => {
    setOpen(prev => !prev)
  }

  const removeItem = (e, id, firstDiscount) => {
    e.stopPropagation()
   handleRemoveItem(id, firstDiscount)
  }

 
  return (
    <div>

      {noParty ? 
        <div >
  
        
          <List component="div" disablePadding>
            {basket.map(product => {
              return (
                <ListItem key={product._id+product.firstDiscount+product.quantity} style={{ paddingLeft: "0.4rem", alignItems: 'flex-start' }}>
                  {activeUsersBasket && 
                  <ListItemAvatar>
                    <img alt="trash" src={uiPaths.trash} style={{width: '2rem', height: '2rem', marginTop:'0.4rem'}} onClick={(e) => removeItem(e, product._id, product.firstDiscount)}/>
                  </ListItemAvatar>
                  }
                  <Grid container direction="column" justify="space-between" align="flex-start">
                <Grid item>
                  <PintoTypography variant="h5">{product.name}</PintoTypography>
                </Grid>
                <Grid item>
                {product.hasOwnProperty('awards') && product.awards &&
                      product.awards.map((prize, index) => {
                        return <PintoTypography key={prize.itemModel._id+index} style={{color: palette.primary.main}}>{prize.itemModel.name} <span>{prize.quantity > 1 && " x"+prize.quantity}</span></PintoTypography>
                      })}
                </Grid>
                <Grid item container direction="row" justify="flex-end" align="center">
                  <PintoTypography style={{fontSize:'1.2rem'}}>{product.quantity+"x"}</PintoTypography>
                  <PintoTypography style={{fontSize:'1.2rem'}}>{product.price.toFixed(2) + " ZŁ"}</PintoTypography>
                  <PintoTypography style={{fontSize:'1.2rem', background: product.firstDiscount && 'gold'}}>{"= " + (product.quantity * product.price).toFixed(2) + " ZŁ"}</PintoTypography>
                </Grid>
              </Grid>
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
                <ListItem key={name+product._id+product.firstDiscount+product.quantity} style={{ paddingLeft: "0.4rem", alignItems: 'flex-start' }}>
                {activeUsersBasket && 
                <ListItemAvatar>
                  <img alt="trash" src={uiPaths.trash} style={{width: '2rem', height: '2rem', marginTop:'0.4rem'}} onClick={(e) => removeItem(e, product._id, product.firstDiscount)}/>
                </ListItemAvatar>
                }
                <Grid container direction="column" justify="space-between" align="flex-start">
              <Grid item>
                <PintoTypography variant="h5">{product.name}</PintoTypography>
              </Grid>
              <Grid item>
              {product.hasOwnProperty('awards') && product.awards &&
                    product.awards.map((prize, index) => {
                      return <PintoTypography key={prize.itemModel._id+index} style={{color: palette.primary.main}}>{prize.itemModel.name} <span>{prize.quantity > 1 && " x"+prize.quantity}</span></PintoTypography>
                    })}
              </Grid>
              <Grid item container direction="row" justify="flex-end" align="center">
                <PintoTypography style={{fontSize:'1.2rem'}}>{product.quantity+"x"}</PintoTypography>
                <PintoTypography style={{fontSize:'1.2rem'}}>{product.price.toFixed(2) + " ZŁ"}</PintoTypography>
                <PintoTypography style={{fontSize:'1.2rem', background: product.firstDiscount && 'gold'}}>{"= " + (product.quantity * product.price).toFixed(2) + " ZŁ"}</PintoTypography>
              </Grid>
            </Grid>
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
