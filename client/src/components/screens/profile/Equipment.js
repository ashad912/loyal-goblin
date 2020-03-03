import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import EquipmentItem from "./EquipmentItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import {itemTypeLabels} from  "../../../utils/labels";
import { PintoTypography } from "../../../utils/fonts";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    position: "relative"
  }
}));

const Equipment = props => {
  const [openList, setOpenList] = React.useState("");
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState({
    _id: "",
    name: "",
    category: ""
  });

  const classes = useStyles();

  const handleOpenList = event => {
    if (event.currentTarget.dataset.value === openList) {
      setOpenList("");
    } else {
      setOpenList(event.currentTarget.dataset.value);
    }
  };

  const handleShowDeleteDialog = (id, name, category) => {
    setItemToDelete({ _id: id, name, category });
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleItemDelete = () => {
    props.handleItemDelete(itemToDelete._id);
    handleDeleteDialogClose();
  };

  React.useEffect(() => {
    setOpenList("");
  }, [props.leaderInShop]);

  const convertToStack = itemsToConvert => {
    let itemModels = [];
    itemsToConvert.forEach(itemToConvert => {
      //NOTE: filter returns new array - if for itemModels gets zero length, it is new name
      if (
        itemModels.filter(
          itemModel => itemModel.name === itemToConvert.itemModel.name
        ).length === 0
      ) {
        itemModels = [...itemModels, itemToConvert.itemModel];
      }
      //console.log(itemModels)
    });

    let itemObjects = [];
    itemModels.forEach(itemModel => {
      let instanceItemsIds = [];
      itemsToConvert.forEach(itemToConvert => {
        if (itemModel.name === itemToConvert.itemModel.name) {
          instanceItemsIds = [...instanceItemsIds, itemToConvert._id];
        }
      });
      const itemObject = {
        itemModel: itemModel,
        instancesIds: instanceItemsIds
      };
      itemObjects = [...itemObjects, itemObject];
    });
    return itemObjects;
  };

  const items = props.items;
  let content = null
  if(Object.keys(items).length > 0 ){
    if(props.leaderInShop ){
      content = (
      <Typography
        variant="h5"

        style={{  padding: "1rem", color:"rgb(139, 0, 0)", textAlign:'center' }}
      >
        Zmiana ekwipunku w trakcie expienia niemożliwa
    </Typography>)
    }else if(props.activeMission){
      content = (
      <Typography
        variant="h5"

        style={{  padding: "1rem", color:"rgb(139, 0, 0)", textAlign:'center' }}
      >
        Zmiana ekwipunku w trakcie misji niemożliwa
      </Typography>)
    }else{
      content = (
        <List component="nav" className={classes.root}>
        { Object.keys(items).map(itemCategory => {
          const chest = itemCategory === "amulet" || itemCategory === "torpedo";
          /* const torpedo = itemCategory === "torpedo";
          if (torpedo) {
            return null;
          }  */
          let stackedItems;
          if (chest) {
            stackedItems = convertToStack(items[itemCategory]);
            //console.log(stackedItems)
          }
          return !chest ? (
            <React.Fragment key={itemCategory}>
              <ListItem onClick={handleOpenList} data-value={itemCategory}>
          <ListItemText primary={<PintoTypography style={{fontSize:'1.4rem', fontWeight:'bolder'}}>{itemTypeLabels[itemCategory]}</PintoTypography>} />
                {openList === itemCategory ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                in={openList === itemCategory}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {items[itemCategory].map((item, index) => (
                    <EquipmentItem
                    isFirst={index===0}
                      key={item._id}
                      equipped={Object.values(props.equipped).find(
                        id => id === item._id
                      )}
                      item={item}
                      handleItemToggle={props.handleItemToggle}
                      itemCategory={itemCategory}
                      handleItemDelete={handleShowDeleteDialog}
                      twoHanded={
                        item.itemModel.hasOwnProperty("twoHanded") &&
                        item.itemModel.twoHanded
                      }
                    />
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <React.Fragment key={itemCategory}>
              <ListItem onClick={handleOpenList} data-value={itemCategory}>
              <ListItemText primary={<PintoTypography style={{fontSize:'1.4rem', fontWeight:'bolder'}}>{itemTypeLabels[itemCategory]}</PintoTypography>} />
                {openList === itemCategory ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                in={openList === itemCategory}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {stackedItems.map((item, index) => (
                    <EquipmentItem
                    isFirst={index===0}
                      key={item.itemModel._id}
                      stacked={true}
                      item={item}
                      handleItemToggle={props.handleItemToggle}
                      itemCategory={itemCategory}
                      handleItemDelete={handleShowDeleteDialog}
                    />
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
      )
    }

  }else{
    content = (
      <Typography
      variant="caption"
      component="p"
      style={{ padding: "1rem" }}
    >
      Ekwipunek jest pusty. Idź expić, by zdobyć przedmioty!
    </Typography>
    )
  }

  return (
    <Drawer anchor="right" open={props.isOpen} onClose={()=>props.toggle(false)} onOpen={()=>props.toggle(true)} disableBackdropTransition={true}>
      
      <div style={{padding: '1rem', width: '75vw'}}>
      {content}

      </div>

      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Wyrzucanie przedmiotu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz wyrzucić przedmiot {itemToDelete.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Anuluj</Button>
          <Button onClick={handleItemDelete} color="secondary" autoFocus>
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Equipment;
