import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import OperationDialog from "components/OperationDialog";
import EquipmentItem from "./EquipmentItem";

import { itemTypeLabels } from "utils/labels";
import {convertToStack} from 'utils/functions'
import { PintoTypography } from "assets/fonts";


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

  

  const items = props.items;
  let content = null
  if (Object.keys(items).length > 0) {
    if (props.leaderInShop) {
      content = (
        <Typography
          variant="h5"

          style={{ padding: "1rem", color: "rgb(139, 0, 0)", textAlign: 'center' }}
        >
          Zmiana ekwipunku w trakcie przygody niemożliwa
        </Typography>)
    } else if (props.activeMission) {
      content = (
        <Typography
          variant="h5"

          style={{ padding: "1rem", color: "rgb(139, 0, 0)", textAlign: 'center' }}
        >
          Zmiana ekwipunku w trakcie misji niemożliwa
        </Typography>)
    } else {
      content = (
        <List component="nav" className={classes.root}>
          {Object.keys(items).map(itemCategory => {
            const chest = itemCategory === "amulet" || itemCategory === "torpedo";
            const stackedItems = chest && convertToStack(items[itemCategory]);
            const itemsToMap = chest ? stackedItems : items[itemCategory]

            return (
              <React.Fragment key={itemCategory}>
                <ListItem onClick={handleOpenList} data-value={itemCategory}>
                  <ListItemText primary={<PintoTypography style={{ fontSize: '1.4rem', fontWeight: 'bolder' }}>{itemTypeLabels[itemCategory]}</PintoTypography>} />
                  {openList === itemCategory ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={openList === itemCategory}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {
                      itemsToMap.map((item, index) => (
                        <EquipmentItem
                          isFirst={index === 0}
                          key={chest ? item.itemModel._id : item._id}
                          equipped={
                            !chest ? (
                              Object.values(props.equipped)
                                .find(
                                  id => id === item._id
                                )
                            ) : null
                          }
                          stacked={chest}
                          item={item}
                          handleItemToggle={props.handleItemToggle}
                          itemCategory={itemCategory}
                          handleItemDelete={handleShowDeleteDialog}
                          twoHanded={
                            !chest &&
                            item.itemModel.hasOwnProperty("twoHanded") &&
                            item.itemModel.twoHanded
                          }
                        />
                      ))
                    }
                  </List>
                </Collapse>
              </React.Fragment>
            )
          })}
        </List>
      )
    }

  } else {
    content = (
      <Typography
        variant="caption"
        component="p"
        style={{ padding: "1rem" }}
      >
        Ekwipunek jest pusty. Wyrusz na przygodę, by zdobyć przedmioty!
      </Typography>
    )
  }

  return (
    <Drawer anchor="right" open={props.isOpen} onClose={() => props.toggle(false)} onOpen={() => props.toggle(true)} disableBackdropTransition={true}>

      <div style={{ padding: '1rem', width: '75vw' }}>
        {content}
      </div>
      <OperationDialog 
        open={deleteDialog}
        onClose={handleDeleteDialogClose}
        handleAction={handleItemDelete}
        title="Wyrzucanie przedmiotu"
        desc={`Czy na pewno chcesz wyrzucić przedmiot ${itemToDelete.name}?`}
        cancelText="Anuluj"
        confirmText="Potwierdź"
      />
    </Drawer>
  );
};

export default Equipment;
