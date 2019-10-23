import React from "react";
import styled from "styled-components";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const AddIcon = styled(AddCircleIcon)`
  width: 2rem;
  transition: transform 0.2s ease-in-out;
  transform: scale(1.8);
  &:active {
    transform: scale(1.5);
  }
`;

const ShopListItem = props => {
  const price = props.price;
  const name = props.name;
  const description = props.description;
  const imgSrc = props.imgSrc;
  return (
    <ListItem>
      <ListItemIcon>
        <img src={require("../../../assets/shop/"+imgSrc)} style={{width: '2rem'}}/>
      </ListItemIcon>
      <Grid container direction="column">
        <ListItemText primary={name} />
        {props.prizes &&
        props.prizes.map(prize => {
          return <ListItemText secondary={<span>{prize.itemModel.name} <img width={16} src={require('../../../assets/icons/items/'+prize.itemModel.imgSrc)}/></span>}/>

        })}
        <ListItemText secondary={description} />
      </Grid>
      <ListItemIcon>
      <Grid container direction="column">
        <Typography variant="body1" style={{marginRight: '2rem'}}>{price.toFixed(2) + " ZŁ"}</Typography>
        <Typography variant="body2" style={{marginRight: '2rem'}}>+ {parseInt(price*10) + " PD"}</Typography>
      </Grid>
      </ListItemIcon>
      <AddIcon onClick={e => props.handleAddItem(e, props.id)} />
    </ListItem>
  );
};

export default ShopListItem;
