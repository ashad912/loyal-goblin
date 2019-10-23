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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TorpedoListItem from './TorpedoListItem'

import itemCategories from '../../../assets/categories/items'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: '1rem'
  }
}));

const TorpedoList = props => {
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

  const handleShowDeleteDialog = (id, name) => {
    setItemToDelete({id, name})
    setDeleteDialog(true)

  }

  const handleDeleteDialogClose = () => {

    setDeleteDialog(false)
  }

  const handleTorpedoDelete = () => {
    props.handleTorpedoDelete(itemToDelete.id)
    handleDeleteDialogClose()
  }


  return (
    <Paper className={classes.root}>
        <List component="nav" className={classes.root}>
            
            <React.Fragment >
                <ListItem onClick={handleOpenList} data-value={"Torpedy"}>
                <ListItemText primary={'Torpedy'} />
                {openList === 'Torpedy' ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                    in={openList === 'Torpedy'}
                    timeout="auto"
                    unmountOnExit
                >
                <List component="div" disablePadding>
                    {props.userTorpedos.map(item => (
                        <TorpedoListItem item={item} loadedTorpedoId={props.loadedTorpedoId} handleTorpedoToggle={props.handleTorpedoToggle} handleItemDelete={handleShowDeleteDialog}/>
                    ))}
                </List>
                </Collapse>
            </React.Fragment>
            
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
            <Button onClick={handleTorpedoDelete} color="primary" autoFocus>
                Potwierdź
            </Button>
            </DialogActions>
        </Dialog>
    </Paper>
  );
};

export default TorpedoList;
