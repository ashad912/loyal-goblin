import React from "react";
import styled from "styled-components";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {PintoTypography, PintoSerifTypography} from '../../../utils/fonts'
import {itemsPath, productsPath, palette} from '../../../utils/definitions'

const AddIcon = styled(AddCircleIcon)`
  width: 2rem;
  height: 2rem;
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
  const firstDiscount = props.firstDiscount
  let experienceModified = props.experienceModified
  const name = props.name;
  const description = props.description;
  const imgSrc = props.imgSrc;
  return (
    <ListItem >
      <Grid container direction="column" justify="space-between" alignItems="flex-start">
  <Grid item container direction="row" justify="space-between" alignItems="flex-start">
    <Grid item xs={2}>
      <img src={productsPath+imgSrc} style={{width: '3rem', height: '3rem'}}/>
    </Grid>
    <Grid item xs={6}>
    <Grid item container direction="column" justify="space-between" alignItems="flex-start">
      <PintoTypography style={{fontSize:'1.4rem', marginTop:0}}>{name}</PintoTypography>
      <Grid item>
      {props.awards &&
        props.awards.map((prize, index) => {
          return <PintoTypography key={prize.itemModel._id+index} style={{color: palette.primary.main}}>{prize.itemModel.name} <img width={16} src={itemsPath + prize.itemModel.imgSrc}/><span>{prize.quantity > 1 && " x"+prize.quantity}</span></PintoTypography>
        })}
      </Grid>
      <Grid item>
        <PintoTypography style={{color: palette.background.darkGrey}}>{description}</PintoTypography>
      </Grid>
    </Grid>
    </Grid>
    <Grid item xs={2}>
      <Grid item container direction="column" justify="space-between" alignItems="flex-start">
        <Typography variant="body1" style={{color: priceModified ? priceModified : 'inherit', background: firstDiscount && 'gold'}}>{price.toFixed(2) + " ZŁ"}</Typography>
        <Typography variant="body2" style={{color: experienceModified ? experienceModified : palette.background.darkGrey}}>+ {exp + " PD"}</Typography>
      </Grid>
    </Grid>
    <Grid item xs={2} style={{textAlign:'center'}}>
      <AddIcon onClick={e => props.handleAddItem(e, props.id, firstDiscount)} />
    </Grid>
  </Grid>
</Grid>
      {/* <ListItemIcon>
        <img src={productsPath+imgSrc} style={{width: '3rem', height: '3rem'}}/>
      </ListItemIcon>
      <Grid container direction="column" justify="flex-start">
  <ListItemText primary={<PintoTypography style={{fontSize:'1.4rem', marginTop:0}}>{name}</PintoTypography>} />
        {props.awards &&
        props.awards.map((prize, index) => {
          return <ListItemText key={prize.itemModel._id+index} secondary={<PintoTypography>{prize.itemModel.name} <img width={16} src={itemsPath + prize.itemModel.imgSrc}/><PintoTypography>{prize.quantity > 1 && " x"+prize.quantity}</PintoTypography></PintoTypography>}/>

        })}
        <ListItemText secondary={<PintoTypography>{description}</PintoTypography>} />
      </Grid>
      <ListItemIcon>
      <Grid container direction="column">
        <Typography variant="body1" style={{marginRight: '2rem', color: priceModified ? priceModified : 'inherit', background: firstDiscount && 'gold'}}>{price.toFixed(2) + " ZŁ"}</Typography>
        <Typography variant="body2" style={{marginRight: '2rem', color: experienceModified ? experienceModified : 'inherit'}}>+ {exp + " PD"}</Typography>
      </Grid>
      </ListItemIcon>
      <AddIcon onClick={e => props.handleAddItem(e, props.id, firstDiscount)} /> */}
    </ListItem>
  );
};

{/* <Grid container direction="column" justify="space-between" alignItems="flex-start">
  <Grid item container direction="row" justify="space-between" alignItems="flex-start">
    <Grid item xs={2}>
      <img src={productsPath+imgSrc} style={{width: '3rem', height: '3rem'}}/>
    </Grid>
    <Grid item xs={6}>
      <PintoTypography style={{fontSize:'1.4rem', marginTop:0}}>{name}</PintoTypography>
    </Grid>
    <Grid item xs={2}>
      <Grid item container direction="column" justify="space-between" alignItems="center">
        <Typography variant="body1" style={{marginRight: '2rem', color: priceModified ? priceModified : 'inherit', background: firstDiscount && 'gold'}}>{price.toFixed(2) + " ZŁ"}</Typography>
        <Typography variant="body2" style={{marginRight: '2rem', color: experienceModified ? experienceModified : 'inherit'}}>+ {exp + " PD"}</Typography>
      </Grid>
    </Grid>
    <Grid item xs={2}>
      <AddIcon onClick={e => props.handleAddItem(e, props.id, firstDiscount)} />
    </Grid>
  </Grid>
  <Grid item container direction="row" justify="space-between" alignItems="flex-start">
    <Grid item xs={2}>

    </Grid>
    <Grid item container direction="column" alignItems="flex-start" xs={10}>
      <Grid item>
      {props.awards &&
        props.awards.map((prize, index) => {
          return <PintoTypography key={prize.itemModel._id+index}>{prize.itemModel.name} <img width={16} src={itemsPath + prize.itemModel.imgSrc}/><span>{prize.quantity > 1 && " x"+prize.quantity}</span></PintoTypography>
        })}
      </Grid>
      <Grid item>
        <PintoTypography>{description}</PintoTypography>
      </Grid>
    </Grid>
  </Grid>
</Grid> */}

export default ShopListItem;
