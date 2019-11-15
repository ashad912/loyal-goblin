import React from "react";
import styled, {keyframes}  from 'styled-components'
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import PerkListBox from './PerkListBox'
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {itemTypeLabels, classLabels} from '../../../utils/labels'


const StyledListItem = styled(ListItem)`
    padding-left: 1rem;
`


const ItemListItem = ({
    item,
    editItem,
    deleteItem,
    isLast
}) => {

  const [openEffect, setOpenEffect] = React.useState("");
 

 

  const handleOpenEffect = event => {
    if (event.currentTarget.dataset.value === openEffect) {
      setOpenEffect("");
    } else {
      setOpenEffect(event.currentTarget.dataset.value);
    }
  };


  console.log(item)
  return (
    <React.Fragment>

    <StyledListItem active={false}>
      <Grid container direction="column" spacing={2}>
        <Grid item container>
          <Grid item xs={2}>
            <Typography >
                {itemTypeLabels[item.type]}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography >
                {item.hasOwnProperty('twoHanded') ? (item.twoHanded ? ('Dwuręczna') : ('Jednoręczna')) : null}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex">
                <Typography >
                    {`${item.class ? classLabels[item.class] : 'Wszystkie klasy'}`}
                </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={2}>
            <img
              src={(item.imgSrc.includes('blob') || item.imgSrc.includes('data:image')) ? (item.imgSrc) : (require("../../../assets/icons/items/" + item.imgSrc))}
              width={32}
            />
          </Grid>
          <Grid item container direction="column" xs={6}>
            <Grid item>
              <Typography variant="h5" style={{fontSize: '1.2rem', fontWeight: 'bolder'}}>{item.name}</Typography>
            </Grid>
            <Grid item>
                <Typography >{item.description}</Typography>
            </Grid>
            <Grid item>
              
            </Grid>
            
          </Grid>
          <Grid
            item
            container
            direction="column"
            justify="space-around"
            xs={2}
            spacing={2}
          >
          </Grid>
          <Grid item container direction="column" xs={2} spacing={2} style={{textAlign: 'right'}}>
            <Grid item>
              <Button color="primary" onClick={e => editItem(item._id)}>Edytuj</Button>
            </Grid>
            
            <Grid item>
              <Button onClick={e => deleteItem(item._id, item.name)} color="secondary">
                Usuń
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {item.perks.length > 0 && (
          <List component="nav" style={{width: '100%', borderTop: '1px solid #ddd'}}>
              
              
              <ListItem onClick={handleOpenEffect} data-value={item._id} style={{paddingLeft: '0.5rem'}}>
                <ListItemText primary={'Efekty'} />
                {openEffect === item._id ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                in={openEffect === item._id}
                timeout="auto"
                unmountOnExit
              >
              <PerkListBox
                  perks={item.perks}
                  headers={false}
                  typeWidth={4}
                  valueWidth={2}
                  targetWidth={1}
                  timeWidth={5}
                  breakWidth={0}
                  actions={false}
                  buttonsWidth={0}
                />
                      
                </Collapse>
          </List>
        )}
      </Grid>
    </StyledListItem>
    {!isLast && <Divider />}
    </React.Fragment>
  );
};

export default ItemListItem;
