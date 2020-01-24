import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";

import ExpandMore from "@material-ui/icons/ExpandMore";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TorpedoListItem from './TorpedoListItem'



const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    
  }
}));

const TorpedoList = props => {
  const [openList, setOpenList] = React.useState("");
  const [deleteDialog, setDeleteDialog] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState({id: '', name: '', category: ''})
  const [activeTorpedo, setActiveTorpedo] = React.useState(undefined)

  const classes = useStyles();
  
  const parentDialog = React.createRef()

  const handleOpenList = event => {
    if (event.currentTarget.dataset.value === openList) {
      setOpenList("");
    } else {
      setOpenList(event.currentTarget.dataset.value);
    }
  };

  const handleShowDeleteDialog = (id, name) => {
    console.log(parentDialog)
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

  const handleTorpedoToggle = (id) => {
    // const torpedo = this.state.userTorpedos.find((torpedo) => {
    //   return torpedo._id === id
    // })
    // this.setState({
    //     loadedTorpedo: torpedo
    // })
    if(activeTorpedo !== id){
      setActiveTorpedo(id)
    }else{
      setActiveTorpedo(undefined)
    }
    
  }

  const handleClose = () => {
    props.handleClose()
  }

  const handleSave = () => {
    props.handleTorpedoToggle(activeTorpedo)
    handleClose()
  }
  const convertToStack = (itemsToConvert) => {
    let itemModels = []
    itemsToConvert.forEach((itemToConvert) => {
      //NOTE: filter returns new array - if for itemModels gets zero length, it is new name
      if(itemModels.filter(itemModel => itemModel.name === itemToConvert.itemModel.name).length === 0){
        itemModels = [...itemModels, itemToConvert.itemModel]
      }
      //console.log(itemModels)
    })
  
    let itemObjects = []
    itemModels.forEach((itemModel) => {
      let instanceItemsIds = []
      itemsToConvert.forEach((itemToConvert) => {
        if(itemModel.name === itemToConvert.itemModel.name){
          instanceItemsIds = [...instanceItemsIds, itemToConvert._id]
        }
      })
      const itemObject = {itemModel: itemModel, instancesIds: instanceItemsIds}
      itemObjects = [...itemObjects, itemObject]
    })
    return itemObjects
  }

  const userTorpedos = convertToStack(props.userTorpedos)
  //console.log(userTorpedos)
  return (
    <Dialog
        open={props.handleOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
    <Paper className={classes.root}>
      {userTorpedos.length ? (
        <List component="nav" className={classes.root}>
            
            <React.Fragment >
                <ListItem onClick={handleOpenList} data-value={"Torpedy"}>
                <ListItemText primary={'Torpedy'} />
                <ExpandMore />
                </ListItem>
                
                <List component="div" disablePadding style={{maxHeight: '264px'}}>
                    {userTorpedos.map(item => (
                        <TorpedoListItem key={item.itemModel._id} item={item} loadedTorpedoId={activeTorpedo} handleTorpedoToggle={handleTorpedoToggle} handleItemDelete={handleShowDeleteDialog}/>
                    ))}
                </List>
                
            </React.Fragment>
            
        </List>
      ) : (
        <ListItem onClick={handleOpenList} data-value={"Torpedy"}>
                <ListItemText primary={`Brak torped! Kup piwo :)`} />
              
                </ListItem>
        
      )}
        
        <DialogActions>
          {/* {(props.userTorpedos.length > 0) && (
            <Button onClick={handleSave} color="primary">
              Zatwierdź
            </Button>
          )} */}
          
          <Button onClick={handleSave} color="primary" autoFocus>
              Powrót
          </Button>
        </DialogActions>
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
              <Button onClick={handleDeleteDialogClose} color="secondary">
                  Anuluj
              </Button>
              <Button onClick={handleTorpedoDelete} color="primary" autoFocus>
                  Potwierdź
              </Button>
            </DialogActions>
        </Dialog>
        
    </Paper>
    </Dialog>
  );
};

export default TorpedoList;
