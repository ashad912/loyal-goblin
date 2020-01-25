import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ProductCreator from "../products/ProductCreator";
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
import ProductListItem from '../products/ProductListItem'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {categoryLabels} from '../../utils/labels'
import {getProducts, deleteProduct} from '../../store/actions/productActions'

const AdminProducts = () => {
  const [showNewProductCreator, setShowNewProductCreator] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [nameFilter, setNameFilter] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState(products);
  const [modifyingIndex, setModifyingIndex] = React.useState(null)

  const [deleteDialog, setDeleteDialog] = React.useState(false)
  const [productToDelete, setProductToDelete] = React.useState({_id: '', name: ''})

  const [productToPass, setProductToPass] = React.useState({   
      _id: null,
      category: null,
      name: null,
      description: null,
      price: null,
      imgSrc: null,
      awards: [],
  })

  const fetchProducts = async () => {
    const products = await getProducts()
    setProducts(products)
  }

  React.useEffect(() => {
    fetchProducts()
  }, [])

  const toggleProductCreator = e => {
    if(showNewProductCreator){
      setModifyingIndex(null)
      applyStatusFilter(statusFilter);
    }
    setShowNewProductCreator(prev => !prev);
  };

  React.useEffect(() => {
    let tempItemsList = applyStatusFilter(statusFilter);
    if (nameFilter.trim().length > 0) {
      tempItemsList = tempItemsList.filter(
        item => item.name.search(nameFilter) !== -1
      );
      setFilteredProducts(tempItemsList)
    }else{
      
      setFilteredProducts(tempItemsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFilter]);

  React.useEffect(() => {
    applyStatusFilter(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const handleChangeNameFilter = e => {
    setNameFilter(e.target.value.trim());
  };

  const applyStatusFilter = status => {
    let tempItems = [...products];
    switch (status) {
      case "all":
        break;
      default:
        tempItems = tempItems.filter(product => product.category === status);
        break;
    }

    setFilteredProducts(tempItems);
    return tempItems
  };

  const handleChangeStatusFilter = e => {
    const status = e.target.value;
    setStatusFilter(status);
    applyStatusFilter(status);
  };

  const handleAddItemCreator = (index) => {
    setProductToPass({   
      _id: null,
      category: null,
      name: '',
      price: null,
      description: '',
      imgSrc: null,
      awards: [],
    })
    toggleProductCreator()  
  }

  const handleEditItemCreator = (id) => {
    console.log(id)
    const index = products.findIndex((product) => {return product._id === id})
    setProductToPass(products[index])
    setModifyingIndex(index)
    toggleProductCreator()
    
  }

  const updateProducts = (product) => {
    console.log(product)
    fetchProducts()
    if(modifyingIndex != null){
      // const tempProducts = [...products]

      // tempProducts[modifyingIndex] = product

      // setProducts(tempProducts)
      toggleProductCreator()
     
      
    }else{
      // setProducts([...products, product])
      toggleProductCreator()
    }
    
  }

  const handleDeleteDialogOpen = (id, name) => {
   
    setProductToDelete({_id: id, name: name})
    setDeleteDialog(true)
  }

  const handleDeleteDialogClose = () => {
   
    setProductToDelete({_id: '', name: ''})
    setDeleteDialog(false)
  }

  const handleProductDelete = async () => {

    console.log(productToDelete)
    await deleteProduct(productToDelete._id)
    
   
    // const tempItems = [...products]
    // const newItems = tempItems.filter((item, itemIndex) => {
    //   return item._id !== productToDelete._id
    // })
    fetchProducts()
    //setProducts(newItems)
    handleDeleteDialogClose()
  }


  return (
    <div>
      {showNewProductCreator ? (
        <ProductCreator
          open={showNewProductCreator}
          handleClose={toggleProductCreator}
          product={productToPass}
          modifyingProductIndex={modifyingIndex}
          updateProducts={updateProducts} 
        />
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItemCreator}
          >
            Nowy produkt
          </Button>
          <Typography variant="h5" style={{ marginTop: "2rem" }}>
            Lista produktów
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
                {Object.keys(categoryLabels).map((categoryKey) => {
                  return <MenuItem key={categoryKey} value={categoryKey}>{categoryLabels[categoryKey]}</MenuItem>
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
            {filteredProducts.length > 0 && (
              <List
                style={{
                  width: "70%",
                  border: "1px solid grey",
                  margin: "0 auto"
                }}
              >
              {filteredProducts.map((product, index) => {
                return (
                  <React.Fragment key={product._id}>
                  <ProductListItem
                    key={product._id}
                    index={index}
                    isLast={filteredProducts.length - 1 === index}
                    product={product}
                    //activateNow={handleShowActivateNowDialog}
                    editProduct={handleEditItemCreator}
                    deleteProduct={handleDeleteDialogOpen}
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
            <DialogTitle >Usuwanie produktu</DialogTitle>
            <DialogContent>
              <DialogContentText >
                      <span>Czy na pewno chcesz usunąć produkt {productToDelete.name}?</span>< br/>
                      Produkt zostanie usunięty ze sklepu.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="secondary">
                Anuluj
              </Button>
              <Button onClick={handleProductDelete} color="primary" autoFocus>
                Potwierdź
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        
      )}
    </div>
  )
};

export default AdminProducts;