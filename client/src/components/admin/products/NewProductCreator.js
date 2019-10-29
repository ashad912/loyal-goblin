import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import ItemsModal from './ItemsModal'


import characterClasses from "../../../assets/categories/characterClasses";
import {categoryLabels} from '../../../utils/labels'


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
const mockItems = [
    {
      
        _id: 101,
        type: "amulet",
        name: "Diament",
        fluff: "Najlepszy przyjaciel dziewyczyny",
        imgSrc: "diamond-amulet.png",
        class: "any"
      
    },
    {
      
        _id: 102,
        type:  "amulet",
        name: "Perła",
        fluff: "Perła prosto z lodówki, znaczy z małży",
        imgSrc: "pearl-amulet.png",
        class: "any"
      
    },
  {
        _id: 201,
        type: "weapon",
        name: "Krótki miecz",
        fluff: "Przynajmniej nie masz kompleksów",
        imgSrc: "short-sword.png",
        class: "any"
      
    },
    {
     
        _id: 202,
        type: "weapon",
        name: "Wielki miecz",
        fluff: "Zdecydowanie masz kompleksy",
        imgSrc: "short-sword.png",
        class: "warrior",
        perks: [
          {
            perkType: "attr-strength",
            target: undefined,
            time: [],
            value: "+1"
          }
        ]
      
    },
    {
      
        _id: 203,
        type: "weapon",
        name: "Kostur twojej starej",
        fluff: "Niektórzy mówią, że to tylko miotła",
        imgSrc: "short-sword.png",
        class: "mage"
      
    },
    {
      
        _id: 204,
        type:  "weapon",
        name: "Nusz",
        fluff: "(ja)nusz",
        imgSrc: "short-sword.png",
        class: "rogue"
      
    },
    {
      
        _id: 205,
        type: "weapon",
        name: "Morgensztern",
        fluff: "Adam Małysz, jeszcze cię pokonam",
        imgSrc: "short-sword.png",
        class: "cleric"
      
    },
    {
        _id: 301,
        type: "chest",
        name: "Skórzana kurta",
        fluff: "Lale za takimi szaleją",
        imgSrc: "leather-jerkin.png",
        class: "any"
      
    },
    {
      
        _id: 302,
        type: "chest",
        name: "Sutanna bojowa",
        fluff: "Wiadomo, kto jest kierownikiem tej plebanii",
        imgSrc: "leather-jerkin.png",
        class: "cleric"
      
    },
  {
        _id: 401,
        type: "legs",
        name: "Lniane spodnie",
        fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
        imgSrc: "linen-trousers.png",
        class: "any"
      
    },
    {
        _id: 402,
        type: "legs",
        name: "Nogawice płytowe",
        fluff: "Nie da się w nich klękać do miecza",
        imgSrc: "linen-trousers.png",
        class: "warrior"
      
    },
     {
        _id: 403,
        type: "legs",
        name: "Ledżinsy",
        fluff: "Obcisłe jak lubisz",
        imgSrc: "linen-trousers.png",
        class: "rogue"
      },
   {
        _id: 501,
        type: "feet",
        name: "Wysokie buty",
        fluff: "Skórzane, wypastowane, lśniące",
        imgSrc: "high-boots.png",
        class: "any"
      
    },
    {
        _id: 502,
        type: "feet",
        name: "Kapcie cichobiegi",
        fluff: "+10 do testów skradania na linoleum",
        imgSrc: "high-boots.png",
        class: "rogue"
      },
    
   {
        _id: 601,
        type: "head",
        name: "Czapka z piórkiem",
        fluff: "Wesoła kompaniaaaa",
        imgSrc: "feathered-hat.png",
        class: "any"
      
    },
    {
        _id: 602,
        type: "head",
        name: "Kaptur czarodzieja",
        fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
        imgSrc: "wizard-coul.png",
        class: "mage",
        perks: [
          {
            perkType: "experience",
            target: undefined,
            time: [
              {
                hoursFlag: false,
                lengthInHours: 24,
                startDay: 5,
                startHour: 12
              }
            ],
            value: "+10%"
          }
        ]
      },
    {
        _id: 701,
        type: "ring",
        name: "Pierścień wódy",
        fluff: "Całuj mój sygnet potęgi",
        imgSrc: "strength-ring.png",
        class: "any",
        perks: [
          {
            perkType: "disc-product",
            target: { name: "Wóda" },
            time: [
              { hoursFlag: true, lengthInHours: 2, startDay: 1, startHour: 18 }
            ],
            value: "-10%"
          }
        ]
    },
  ]


const productCategories = ['shots', 'drinks', 'beer', 'food', 'alco-free']

class NewProductCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: "",
    price: "",
    category: productCategories[0],  
    formError: {
        price: undefined,
    },
    showItemsModal: false,
    awards: [],
  };



  handleIconChange = e => {
    this.setState({ icon: URL.createObjectURL(e.target.files[0]) });
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


    callbacksAndValidation = (fieldName, fieldValue, prevFieldValue) => {
    
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

  handleToggleItemsModal = e => {
    this.setState(prevState => {
      return { showItemsModal: !prevState.showItemsModal };
    });
  };
 

  componentDidUpdate(){
      //console.log(this.state.class)
  }

  render() {
    

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button>{"< Powrót do panelu produktów"}</Button>
        <Container style={{margin: '1rem 0 0 0'}}>
        <Grid container spacing={5} style={{minHeight: '80px'}}>
            
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
                        {productCategories.map((category) => {
                            return(
                                <MenuItem value={category}>{categoryLabels[category]}</MenuItem>
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
                        {this.state.icon ? "Zmień ikonę" : "Dodaj ikonę"}
                        </FileInputButton>
                        <HiddenFileInput
                        type="file"
                        accept="image/*"
                        onChange={this.handleIconChange}
                        />
                    </FileInputWrapper>
                    </Grid>
                    <Grid
                        item
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                        <img src={this.state.icon} style={{ width: "64px" }} />
                    </Grid>
                </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
          
          <Grid item xs={8} style={{textAlign: 'left'}}>
            <TextField
              name="name"
              value={this.state.name}
              margin="dense"
              label={`Nazwa produktu`}
              type="text"
              fullWidth
              onChange={this.handleChangeNameValue}
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
         <Grid
            container
            direction="column"
            spacing={2}
            alignItems="flex-start"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleToggleItemsModal}
              >
                Dodaj nagrody
              </Button>
            </Grid>
          </Grid>
          {!this.state.showItemsModal && (
            <div
              style={{
                maxHeight: "30vh",
                display: "flex",
                justifyContent: "space-around",
                overflow: "hidden",
                width: "70%",
                marginTop: "1rem"
              }}
            >
              {this.state.awards.length > 0 && (
                <div
                  style={{
                    overflow: "auto",
                    flexBasis: "50%"
                  }}
                >
                  <List dense>
                    {this.state.awards.map(award => {
                      return (
                        <ListItem>
                          <ListItemAvatar>
                            <img
                              src={require("../../../assets/icons/items/" +
                                award.itemModel.imgSrc)}
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
              {/* <div style={{ overflow: "auto", flexBasis: "50%" }}>
                <List dense>
                  {Object.keys(this.state.awards)
                    .filter(
                      characterClass =>
                        characterClass !== "any" &&
                        this.state.awards[characterClass].length > 0
                    )
                    .map(characterClass => {
                      return (
                        <React.Fragment>
                          <Typography style={{ fontWeight: "bolder" }}>
                            {characterClasses[characterClass]}
                          </Typography>
                          {this.state.awards[characterClass].map(item => {
                            return (
                              <ListItem>
                                <ListItemAvatar>
                                  <img
                                    src={require("../../../assets/icons/items/" +
                                      item.itemModel.imgSrc)}
                                    style={{ width: "32px", height: "32px" }}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={item.itemModel.name}
                                  secondary={"x" + item.quantity}
                                />
                              </ListItem>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                </List>
              </div> */}
            </div>
          )}
        </Container>
        <ItemsModal
            open={this.state.showItemsModal}
            handleClose={this.handleToggleItemsModal}
            itemsList={mockItems.filter(
              itemModel => itemModel.class === "any"
            )}
            productAwards={this.state.awards}
            handleAddItem={this.handleAddItem}
            handleSubtractItem={this.handleSubtractItem}
            handleChangeItemQuantity={this.handleChangeItemQuantity}
            title={'Dodaj nagrody produktu'}
          />
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewProductCreator;
