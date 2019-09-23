import React from "react";
import styled from 'styled-components'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';


const AddIcon = styled(AddCircleIcon)`
width: 2rem;
transition: transform 0.2s ease-in-out;
transform: scale(1.8);
&:active {
    transform: scale(1.5);
}
`

const ShopListItem = props => {
  const price = props.price;
  const title = props.title;
  const description = props.description;
  const icon = props.icon;
  return (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      <Grid container direction="column">
      <ListItemText primary={title} />
      <ListItemText secondary={description} />
      </Grid>
      <ListItemIcon>{price+' ZŁ'}</ListItemIcon>
      <AddIcon onClick={(e) => props.handleAddItem(e, props.id)} />
    </ListItem>
  );
};

export default ShopListItem;
