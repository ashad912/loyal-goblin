import React from "react";
import styled from "styled-components";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {itemsPath, productsPath} from '../../../utils/definitions'
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
  const exp = props.experience
  let priceModified = props.priceModified
  let experienceModified = props.experienceModified
  const name = props.name;
  const description = props.description;
  const imgSrc = props.imgSrc;
  return (
    <ListItem>
      <ListItemIcon>
        <img src={productsPath+imgSrc} style={{width: '2rem'}}/>
      </ListItemIcon>
      <Grid container direction="column">
        <ListItemText primary={name} />
        {props.awards &&
        props.awards.map((prize, index) => {
          return <ListItemText key={prize.itemModel._id+index} secondary={<span>{prize.itemModel.name} <img width={16} src={itemsPath + prize.itemModel.imgSrc}/><span>{prize.quantity > 1 && " x"+prize.quantity}</span></span>}/>

        })}
        <ListItemText secondary={description} />
      </Grid>
      <ListItemIcon>
      <Grid container direction="column">
        <Typography variant="body1" style={{marginRight: '2rem', color: priceModified ? priceModified : 'inherit'}}>{price.toFixed(2) + " ZŁ"}</Typography>
        <Typography variant="body2" style={{marginRight: '2rem', color: experienceModified ? experienceModified : 'inherit'}}>+ {exp + " PD"}</Typography>
      </Grid>
      </ListItemIcon>
      <AddIcon onClick={e => props.handleAddItem(e, props.id)} />
    </ListItem>
  );
};

export default ShopListItem;
