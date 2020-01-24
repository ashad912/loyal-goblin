import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ItemCreator from "../items/ItemCreator";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ItemListItem from '../items/ItemListItem'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {itemTypeLabelsPlural} from '../../utils/labels'

import {getItemModels, deleteItemModel} from '../../store/actions/itemActions'



const AdminItems = () => {
  const [showNewItemCreator, setShowNewItemCreator] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [nameFilter, setNameFilter] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [filteredItems, setFilteredItems] = React.useState(items);
  const [modifyingIndex, setModifyingIndex] = React.useState(null)

  const [deleteDialog, setDeleteDialog] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState({_id: '', name: ''})

 

  const [itemToPass, setItemToPass] = React.useState({   
      _id: null,
      type: null,
      name: null,
      class: 'any',
      description: null,
      loyalAward: null,
      imgSrc: null,
      appearanceSrc: null,
      perks: [],
  })

  const fetchItemModels = async () => {
    const itemModels = await getItemModels()
    setItems(itemModels)
  }

  React.useEffect(() => {
    fetchItemModels()
  }, [])

  const toggleItemCreator = e => {
    if(showNewItemCreator){
      setModifyingIndex(null)
      applyStatusFilter(statusFilter);
    }
    setShowNewItemCreator(prev => !prev);
  };

  React.useEffect(() => {
    let tempItemsList = applyStatusFilter(statusFilter);
    if (nameFilter.trim().length > 0) {
      tempItemsList = tempItemsList.filter(
        item => item.name.search(nameFilter) !== -1
      );
      setFilteredItems(tempItemsList)
    }else{
      
      setFilteredItems(tempItemsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFilter]);

  React.useEffect(() => {
    applyStatusFilter(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleChangeNameFilter = e => {
    setNameFilter(e.target.value.trim());
  };

  const applyStatusFilter = status => {
    let tempItems = [...items];
    switch (status) {
      case "all":
        break;
      default:
        tempItems = tempItems.filter(item => item.type === status);
        break;
    }

    setFilteredItems(tempItems);
    return tempItems
  };

  const handleChangeStatusFilter = e => {
    const status = e.target.value;
    setStatusFilter(status);
    applyStatusFilter(status);
  };

  const handleAddItemCreator = (index) => {
    setItemToPass({   
      _id: null,
      type: null,
      name: '',
      class: 'any',
      description: '',
      loyalAward: false,
      imgSrc: null,
      appearanceSrc: null,
      perks: [],
    })
    toggleItemCreator()  
  }

  const handleEditItemCreator = (id) => {
    console.log(id)
    const index = items.findIndex((item) => {return item._id === id})
    setItemToPass(items[index])
    setModifyingIndex(index)
    toggleItemCreator()
    
  }

  const updateItems = (item) => {
    console.log(item)

    fetchItemModels()

    if(modifyingIndex != null){
      //const tempItems = [...items]

      //tempItems[modifyingIndex] = item

      //setItems(tempItems)
      
      toggleItemCreator()
      
    }else{
      //setItems([...items, item])
      toggleItemCreator()
    }
    
  }

  const handleDeleteDialogOpen = (id, name) => {
   
    setItemToDelete({_id: id, name: name})
    setDeleteDialog(true)
  }

  const handleDeleteDialogClose = () => {
   
    setItemToDelete({_id: '', name: ''})
    setDeleteDialog(false)
  }

  const handleItemDelete = async () => {
    console.log(itemToDelete)
    await deleteItemModel(itemToDelete._id)
    // const tempItems = [...items]
    // const newItems = tempItems.filter((item, itemIndex) => {
    //   return item._id !== itemToDelete._id
    // })
    fetchItemModels()
    //setItems(newItems)
    handleDeleteDialogClose()
  }

  
  return (
    <div>
      {showNewItemCreator ? (
        <ItemCreator
          open={showNewItemCreator}
          handleClose={toggleItemCreator}
          item={itemToPass}
          modifyingItemIndex={modifyingIndex}
          updateItems={updateItems}
        />
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItemCreator}
          >
            Nowy przedmiot
          </Button>
          <Typography variant="h5" style={{ marginTop: "2rem" }}>
            Lista przedmiotów
          </Typography>

          <Paper
            style={{
              width: "70%",
              margin: "1rem auto",
              padding: "1rem",
              boxSizing: "border-box"
            }}
          >
            <Typography>Filtruj</Typography>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <FormControl style={{ alignSelf: "flex-start" }}>
                <InputLabel htmlFor="status-filter">Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleChangeStatusFilter}
                  inputProps={{
                    id: "status-filter"
                  }}
                >
                {Object.keys(itemTypeLabelsPlural).map((itemTypeKey) => {
                  return <MenuItem value={itemTypeKey}>{itemTypeLabelsPlural[itemTypeKey]}</MenuItem>
                })}

                </Select>
              </FormControl>
              <TextField
                value={nameFilter}
                onChange={handleChangeNameFilter}
                margin="dense"
                label="Szukaj nazwy przedmiotu"
                type="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            </Paper>
            {filteredItems.length > 0 && (
              <List
                style={{
                  width: "70%",
                  border: "1px solid grey",
                  margin: "0 auto"
                }}
              >
              {filteredItems.map((item, index) => {
                return (
                  <React.Fragment>
                  <ItemListItem
                    key={item._id}
                    index={index}
                    isLast={filteredItems.length - 1 === index}
                    item={item}
                    //activateNow={handleShowActivateNowDialog}
                    editItem={handleEditItemCreator}
                    deleteItem={handleDeleteDialogOpen}
                  /> 
                  </React.Fragment>

                );
              })}
            </List>
          )}
          <Dialog
            open={deleteDialog}
            onClose={handleDeleteDialogClose}
          >
            <DialogTitle >Usuwanie przedmiotu</DialogTitle>
            <DialogContent>
              <DialogContentText >
                      <span>Czy na pewno chcesz usunąć przedmiot {itemToDelete.name}?</span>< br/>
                      Przedmiot zostanie usunięty z misji, rajdów, produktów oraz ekwipunku wszystkich użytkowników.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="secondary">
                Anuluj
              </Button>
              <Button onClick={handleItemDelete} color="primary" autoFocus>
                Potwierdź
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        
      )}
    </div>
  );
};

export default AdminItems;
