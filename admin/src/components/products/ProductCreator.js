import React, { Component } from "react";
import styled from "styled-components";
import MomentUtils from "@date-io/moment";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { MuiPickersUtilsProvider} from "@material-ui/pickers";

import ItemsModal from './ItemsModal'

import {asyncForEach} from '../../utils/methods'
import {categoryLabelsSpecifed} from '../../utils/labels'
import {itemsPath, productsPath} from '../../utils/definitions'

import { createProduct, updateProduct, uploadProductImage } from "../../store/actions/productActions";
import { getItemModels } from "../../store/actions/itemActions";


const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: 2.5rem;
  width: 10rem;
  margin: 0.5rem 0 0 0;
`;

const HiddenFileInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 2.5rem;
  width: 10rem;
  user-select: none;
`;

const FileInputButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  height: 2.5rem;
  width: 10rem;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 10rem;
`

const AddIcon = styled(AddCircleIcon)`
  color: #3f51b5;
  width: 1.5rem;
  transition: transform 0.2s ease-in-out;
  transform: scale(1.8);
  &:active {
    transform: scale(1.5);
  }
`;


const validatedFields = ['category', 'name', 'description', 'iconView', 'price']


class ProductCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: '',
    iconView: "",
    price: "",
    category: null,
    formError: {
        price: null,
        name: null,
        description: null,
        iconView: null,
    },
    showItemsModal: false,
    awards: [],
    items: []
  };

  componentDidMount = async () => {
    const product = this.props.product
    //const items = await getItemModels()
    
    
    console.log(product)
    this.setState({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category ? (product.category) : (Object.keys(categoryLabelsSpecifed)[0]),
      price: product.price,
      awards: product.awards,
      iconView: product.imgSrc ? (productsPath + product.imgSrc) : null,
      //items: items
    }, () => {
      this.setState({
        componentMounted: true
      })
    })
  }

  handleIconChange = e => {
    if (e.target.files.length > 0) {
      const url = URL.createObjectURL(e.target.files[0])
      this.setState({ iconView: url, icon: e.target.files[0]}, () => this.callbacksAndValidation('iconView', url));
    }
    
  };



  handleChangeNameValue = (e) => {
    const name = e.target.name
    const value = e.target.value 
    this.setState({
        [name]: value
    }, () => {
        this.callbacksAndValidation(name, value)
    })
  };


  callbacksAndValidation = (fieldName, fieldValue) => {

    if(validatedFields.includes(fieldName)){
      let error = ''

      if(fieldValue.length === 0){
        error = fieldName === 'iconView' ? ('Ikona wymagana!') : ('Pole wymagane!')
      }

      this.setState({
        formError: {
            ...this.state.formError,
            [fieldName]: error
        },
        
      }, () => {
        switch(fieldName) {
          case 'price':
              let valueValid = true
              let valueError = ''
      
              if(fieldValue.length > 0){
                valueValid = fieldValue.trim().match(/^\d+(\.\d{1,2})?$/);
                valueError = valueValid ? undefined : 'Niepoprawna wartość!'
              }else{
                valueValid = true
                valueError = 'Pole wymagane!'
              }
              this.setState({
                formError: {
                    ...this.state.formError,
                    price: valueError
                },
                
              });
            break
          default:
            break
        }
      });
    }
  

  }

  handleSubmit = () => {
    //valdidate and send data
    this.props.handleClose();
  };

  handleSubtractItem = (currentItemModel) => {
    //const allItems = { ...this.state.awards };
    let awards = [...this.state.awards];
    const idOfItem = awards.findIndex(
      award => award.itemModel._id === currentItemModel._id
    );

    awards[idOfItem].quantity -= 1;
    if (awards[idOfItem].quantity === 0) {
      awards.splice(idOfItem, 1);
    }
    
    this.setState({ awards: awards });
  };

  handleAddItem = (currentItemModel) => {
    //const allItems = { ...this.state.awards };
    const awards = [...this.state.awards];
    const idOfItemAlreadyAdded = awards.findIndex(
      award => award.itemModel._id === currentItemModel._id
    );
    if (idOfItemAlreadyAdded === -1) {
      awards.push({ itemModel: currentItemModel, quantity: 1 });
    } else {
      awards[idOfItemAlreadyAdded].quantity += 1;
    }
    
    this.setState({ awards: awards });
  };

  handleChangeItemQuantity = (currentItemModel, quantity) => {
    //const allItems = { ...this.state.items };
    const items = [...this.state.awards];
    const idOfItem = items.findIndex(
      itemModel => itemModel._id === currentItemModel._id
    );

    items[idOfItem].quantity = parseInt(quantity);

    
    this.setState({ awards: items });
  };

  handleToggleItemsModal = async e => {
    let items = []

    if(!this.state.showItemsModal && !this.state.items.length){
      items = await getItemModels()
    }
    
    this.setState(prevState => {
      return { showItemsModal: !prevState.showItemsModal };
    }, () => {
      if(items.length){
        this.setState({
          items: items
        })
      }
    });
  };
 

  saveProduct = async () => {
    

    await asyncForEach(validatedFields, (fieldName) => {
      if(!this.state[fieldName]){
        console.log('halo', fieldName)
        
        this.setState({
          formError: {
              ...this.state.formError,
              [fieldName]: fieldName === 'iconView' ? ('Ikona wymagana!') : ('Pole wymagane!')
          },
          
        });
      }
    })

    let breakFlag = false
    Object.keys(this.state.formError).forEach((targetKey)=>{
      if(this.state.formError[targetKey]){
        breakFlag = true
        return
      }
    })

    if(breakFlag){
      return
    }

    const awards = this.state.awards.map((award) => {
      return {quantity: award.quantity, itemModel: award.itemModel._id}
    })


    const product = {
      _id: this.state._id,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      category: this.state.category,
      awards: awards,
      //imgSrc: this.state.icon,
    }
    
    let productId = null
    if(!(typeof this.props.modifyingProductIndex === "number")){
      delete product._id
      productId = await createProduct(product)
    }else{
      productId = await updateProduct(product)
    }
    
    if(productId && (this.state.icon)){
      const formData = new FormData()
      if(this.state.icon){
        formData.append('icon', this.state.icon)
      }
      
      await uploadProductImage(productId, formData)
    }


    this.props.updateProducts(product)
}


  render() {
    
    
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button onClick={this.props.handleClose}>{"< Powrót do panelu produktów"}</Button>
        <Container style={{margin: '1rem 0 0 0'}}>
        <Grid container spacing={5} style={{minHeight: '80px'}}>
            <Grid item xs={2}></Grid>
            <Grid item xs={4} style={{textAlign: 'left'}}>
                <StyledFormControl >
                    <InputLabel shrink={true} htmlFor="category">Kategoria</InputLabel>
                    <Select
                        autoFocus
                        value={this.state.category}
                        onChange={this.handleChangeNameValue}
                        inputProps={{
                            name: 'category',
                            id: 'category',
                        }}
                    >
                        {Object.keys(categoryLabelsSpecifed).map((category) => {
                            return(
                                <MenuItem value={category}>{categoryLabelsSpecifed[category]}</MenuItem>
                            )
                        })}
                    </Select>
                </StyledFormControl>
            </Grid>
            <Grid item xs={4}>
                <Grid container spacing={2}>
                    <Grid item>
                    <FileInputWrapper>
                        <FileInputButton variant="contained" color="primary">
                        {this.state.iconView ? "Zmień ikonę" : "Dodaj ikonę"}
                        </FileInputButton>
                        <HiddenFileInput
                        type="file"
                        accept="image/*"
                        onChange={this.handleIconChange}
                        />
                    </FileInputWrapper>
                    {this.state.formError.iconView && <Typography style={{color: 'red', fontSize: '0.8rem'}}>{this.state.formError.iconView}</Typography>}
                    </Grid>
                    <Grid
                        item
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                        <img alt='' src={this.state.iconView} style={{ width: "64px" }} />
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} style={{textAlign: 'left'}}>
            <TextField
              name="name"
              value={this.state.name}
              margin="dense"
              label={`Nazwa produktu`}
              type="text"
              fullWidth
              onChange={this.handleChangeNameValue}
              error={this.state.formError.name ? true : false}
              helperText={this.state.formError.name ? (this.state.formError.name) : (null)}
            />
            <TextField
              name="description"
              value={this.state.description}
              margin="dense"
              label={`Opis produktu`}
              type="text"
              fullWidth
              multiline
              rows={2}
              rowsMax={5}
              onChange={this.handleChangeNameValue}
              error={this.state.formError.description ? true : false}
              helperText={this.state.formError.description ? (this.state.formError.description) : (null)}
            />
            <TextField
              style={{width: '30%'}}
              value={this.state.price}
              name="price"
              margin="dense"
              label={`Cena produktu [PLN]`}
              type='text'
              error={this.state.formError.price}
              helperText={this.state.formError.price ? (this.state.formError.price) : ("Np. 7, 10.5, 1.25")}
              onChange={this.handleChangeNameValue}
            />
            
          </Grid>
         </Grid>
         <Grid container spacing={2} style={{marginTop: '1.5rem'}}>
            <Grid item xs={2}></Grid>
           <Grid item xs={8} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          
            <Typography variant="h6">Nagrody produktu</Typography>
            <AddIcon
                style={{marginRight: '0.5rem'}}
                onClick={this.handleToggleItemsModal}
            />
            </Grid>
            </Grid> 
            <Grid container spacing={5}>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
            {!this.state.showItemsModal && (
            
            <div
              style={{
                maxHeight: "30vh",
                display: "flex",
                justifyContent: "flex-start",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {this.state.awards && this.state.awards.length > 0 && (
                <div
                  style={{
                    overflow: "auto",
                  }}
                >
                  <List dense>
                    {this.state.awards.map(award => {
                      return (
                        <ListItem style={{paddingLeft: '0px'}}>
                          <ListItemAvatar>
                            <img alt=''
                              src={itemsPath +
                                award.itemModel.imgSrc}
                              style={{ width: "32px", height: "32px" }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={award.itemModel.name}
                            secondary={"x" + award.quantity}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              )}
            </div>
          )}
          </Grid>
          </Grid>
        </Container>
        <ItemsModal
            open={this.state.showItemsModal}
            handleClose={this.handleToggleItemsModal}
            itemsList={this.state.items.filter(
                itemModel => itemModel.class === "any"
            )}
            productCategory={this.state.category}
            productAwards={this.state.awards}
            handleAddItem={this.handleAddItem}
            handleSubtractItem={this.handleSubtractItem}
            handleChangeItemQuantity={this.handleChangeItemQuantity}
            title={'Dodaj nagrody produktu'}
          />
          <Grid
            container
            justify="center"
            spacing={5}
            style={{ marginTop: "1rem" }}
          >
            <Grid item>
              <Button onClick={this.props.handleClose} color="secondary">
                Anuluj
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.saveProduct}
                color="primary"
                variant="contained"
              >
                Zatwierdź
              </Button>
            </Grid>
          </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

export default ProductCreator;
