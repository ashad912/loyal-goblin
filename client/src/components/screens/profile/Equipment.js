import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import EquipmentListItem from "./EquipmentItem";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  }
}));

const Equipment = props => {
  const [openList, setOpenList] = React.useState("");
  const [deleteDialog, setDeleteDialog] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState({id: '', name: '', category: ''})

  const classes = useStyles();

  const handleOpenList = event => {
    if (event.currentTarget.dataset.value === openList) {
      setOpenList("");
    } else {
      setOpenList(event.currentTarget.dataset.value);
    }
  };

  const handleShowDeleteDialog = (id, name, category) => {
    setItemToDelete({id, name, category})
    setDeleteDialog(true)

  }

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false)
  }

  const handleItemDelete = () => {
    props.handleItemDelete(itemToDelete.id, itemToDelete.category)
    handleDeleteDialogClose()
  }


  const items = props.items;

  return (
    <Paper className={classes.root}>
      <List component="nav" className={classes.root}>
        {Object.keys(items).map(itemCategory => (
          <React.Fragment key={itemCategory}>
            <ListItem onClick={handleOpenList} data-value={itemCategory}>
              <ListItemText primary={itemCategory} />
              {openList === itemCategory ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openList === itemCategory}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {items[itemCategory].map(item => (
                  <EquipmentListItem item={item} handleItemToggle={props.handleItemToggle} itemCategory={itemCategory} handleItemDelete={handleShowDeleteDialog}/>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle >Wyrzucanie przedmiotu</DialogTitle>
        <DialogContent>
          <DialogContentText >
                  Czy na pewno chcesz wyrzucić przedmiot {itemToDelete.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={handleItemDelete} color="primary" autoFocus>
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Equipment;
