import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Box from "@material-ui/core/Box";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ItemsModalListItem from "./ItemsModalListItem";

import itemCategories from '../../../assets/categories/items'
import characterClasses from '../../../assets/categories/characterClasses'

//TODO: pole szukaj, filtry (klasa, poziom, kategoria, perki)
//TODO: taby (wszyscy|klasowe)

const ItemsModal = props => {
  const handleAdd = id => () => {
    props.handleAddItem(id);
  };

  const handleSubtract = id => () => {
    props.handleSubtractItem(id);
  };

  const handleDelete = id => () => {
    props.handleDeleteItem(id);
  };

  const handleChangeQuantity = (e, id) => {
    props.handleChangeItemQuantity(id, e.target.value);
  };

  const handleFirstAdd = (item, characterClass) => {
    props.handleAddItem(item, characterClass);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Dodaj nagrody misji</DialogTitle>
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div
            style={{
              borderRight: "1px solid grey",
              flexBasis: "60%",
              overflow: "auto"
            }}
          >
            <List dense style={{ padding: "1rem" }}>
              {Object.keys(props.itemsList).map(itemCategory => {
                return (
                  <React.Fragment key={itemCategory}>
                    <Typography variant="caption">{itemCategories[itemCategory]}</Typography>
                    <List>
                      {props.itemsList[itemCategory].map(item => {
                        return (
                          <ItemsModalListItem
                            item={item}
                            key={item.itemModel.id}
                            handleAdd={handleFirstAdd}
                          />
                        );
                      })}
                    </List>
                  </React.Fragment>
                );
              })}
            </List>
          </div>
          <div style={{ flexBasis: "40%", overflow: "auto" }}>
            <List dense style={{ padding: "1rem" }}>
              {Object.keys(props.eventItemsList).map(characterClass => {
                return (
                  props.eventItemsList[characterClass].length > 0 &&
                (<React.Fragment key={characterClass}>
                  <Typography style={{fontWeight: 'bolder'}}>{characterClasses[characterClass]}</Typography>
                  <List>
                    {props.eventItemsList[characterClass].map(item => {
                      return (
                        <ListItem key={item.itemModel.id}>
                          <Box display="flex" justifyContent="flex-start" style={{width: '100%'}}>
                          <Typography style={{flexBasis: '80%'}}>{item.itemModel.name}</Typography>
                          <Typography style={{flexBasis: '20%'}}>x{item.quantity}</Typography>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </React.Fragment>))
              })}
            </List>
          </div>
        </div>

        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ItemsModal;
