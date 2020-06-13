import React from "react";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import TorpedoListItem from './TorpedoListItem'
import OperationDialog from "components/OperationDialog";

import { PintoTypography } from "assets/fonts";
import {convertToStack} from 'utils/functions'


const TorpedoDrawer = props => {
    const [deleteDialog, setDeleteDialog] = React.useState(false)
    const [itemToDelete, setItemToDelete] = React.useState({id: '', name: '', category: ''})
    const [activeTorpedo, setActiveTorpedo] = React.useState(null)

 
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
            setActiveTorpedo(null)
        }
        
    }

    const handleClose = () => {
        props.handleClose()
    }

    const handleSave = () => {
        props.handleTorpedoToggle(activeTorpedo)
        handleClose()
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
                <OperationDialog 
                    open={deleteDialog}
                    onClose={handleDeleteDialogClose}
                    handleAction={handleTorpedoDelete}
                    title="Wyrzucanie przedmiotu"
                    desc={`Czy na pewno chcesz wyrzucić przedmiot ${itemToDelete.name}?`}
                    cancelText="Anuluj"
                    confirmText="Potwierdź"
                />
                
            
            </div>
        </Drawer>
    );
};

export default TorpedoDrawer;
