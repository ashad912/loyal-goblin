import React from "react";
import styled from 'styled-components'
import Drawer from "@material-ui/core/Drawer";
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
import { PintoTypography } from "../../../utils/fonts";


const DrawerActions = styled(DialogActions)`

`

const TorpedoDrawer = props => {
    const [openList, setOpenList] = React.useState("");
    const [deleteDialog, setDeleteDialog] = React.useState(false)
    const [itemToDelete, setItemToDelete] = React.useState({id: '', name: '', category: ''})
    const [activeTorpedo, setActiveTorpedo] = React.useState(undefined)

 
    const handleShowDeleteDialog = (id, name) => {
    // console.log(parentDialog)
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
    
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const sub = 520 * (vw/360)
    return (
        
        <Drawer
            anchor="bottom"
            open={props.handleOpen}
            onClose={handleClose}
            
        >
            <div
                style={{
                    width: '100vw',
                    height: '30%',
                    boxSizing: 'border-box',
                    paddingBottom: '0.5rem',

                }}
            >
            {userTorpedos.length ? (
                
                        
                <List 
                    component="div" 
                    disablePadding 
                    style={{
                        maxHeight: `calc(100vh - ${sub}px)`,
                        overflowY: 'scroll',
                    }}>
                    {userTorpedos.map(item => (
                        <TorpedoListItem key={item.itemModel._id} item={item} loadedTorpedoId={activeTorpedo} handleTorpedoToggle={handleTorpedoToggle} handleItemDelete={handleShowDeleteDialog}/>
                    ))}
                </List>
                        
                
            ) : (
                <ListItem >
                    <ListItemText primary={`Brak torped! Kup piwo :)`} />
                </ListItem>
                
            )}
                
                <div
                    style={{
                        display: 'flex',
                        flex: '0 0 auto',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingTop: '10px'
                    }}    
                >
                    {activeTorpedo ?
                        <Button onClick={handleSave} color="primary" autoFocus variant="contained">
                            <PintoTypography>Załaduj</PintoTypography>
                        </Button>
                            :
                        <Button onClick={handleSave} autoFocus color="primary">
                            <PintoTypography>Zamknij</PintoTypography>
                        </Button>
                    }
                </div>
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
                
            
            </div>
        </Drawer>
    );
};

export default TorpedoDrawer;
