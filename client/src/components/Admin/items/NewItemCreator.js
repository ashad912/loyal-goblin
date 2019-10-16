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
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import NewPerkModal from "./NewPerkModal";

import diamondAmulet from "../../../assets/icons/items/diamond-amulet.png";
import sapphireAmulet from "../../../assets/icons/items/sapphire-amulet.png";
import pearlAmulet from "../../../assets/icons/items/pearl-amulet.png";
import emeraldAmulet from "../../../assets/icons/items/emerald-amulet.png";

import "moment/locale/pl";
moment.locale("pl");

const mockAmulets = [
  {
    itemModel: {
      id: 101,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Diament",
      imgSrc: "diamond-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 102,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Perła",
      imgSrc: "pearl-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 103,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Szmaragd",
      imgSrc: "emerald-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 104,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Szafir",
      imgSrc: "sapphire-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 105,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Diament2",
      imgSrc: "diamond-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 106,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Perła2",
      imgSrc: "pearl-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 107,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Szmaragd2",
      imgSrc: "emerald-amulet.png"
    },
    quantity: 0
  },
  {
    itemModel: {
      id: 108,
      type: {
        id: 201,
        type: "amulet"
      },
      name: "Szafir2",
      imgSrc: "sapphire-amulet.png"
    },
    quantity: 0
  }
];

const mockItems = {
  amulet: [
    {
      
      itemModel: {
        id: 101,
        type: {
          id: 1,
          type: "amulet"
        },
        name: "Diament",
        fluff: "Najlepszy przyjaciel dziewyczyny",
        imgSrc: "diamond-amulet.png",
        class: 'any'
      }
    },
    {
     
      itemModel: {
        id: 102,
        type: {
          id: 1,
          type: "amulet"
        },
        name: "Perła",
        fluff: "Perła prosto z lodówki, znaczy z małży",
        imgSrc: "pearl-amulet.png",
        class: 'any'
      }
    }
  ],
  weapon: [
    {
     
      itemModel: {
        id: 201,
        type: {
          id: 2,
          type: "weapon"
        },
        name: "Krótki miecz",
        fluff: "Przynajmniej nie masz kompleksów",
        imgSrc: "short-sword.png",
        class: 'any'
      }
    },
    {
     
      itemModel: {
        id: 202,
        type: {
          id: 2,
          type: "weapon"
        },
        name: "Wielki miecz",
        fluff: "Zdecydowanie masz kompleksy",
        imgSrc: "short-sword.png",
        class: 'warrior'
      }
    },
    {
     
      itemModel: {
        id: 203,
        type: {
          id: 2,
          type: "weapon"
        },
        name: "Kostur twojej starej",
        fluff: "Niektórzy mówią, że to tylko miotła",
        imgSrc: "short-sword.png",
        class: 'mage'
      }
    },
    {
     
      itemModel: {
        id: 204,
        type: {
          id: 2,
          type: "weapon"
        },
        name: "Nusz",
        fluff: "(ja)nusz",
        imgSrc: "short-sword.png",
        class: 'rogue'
      }
    },
    {
     
      itemModel: {
        id: 205,
        type: {
          id: 2,
          type: "weapon"
        },
        name: "Morgensztern",
        fluff: "Adam Małysz, jeszcze cię pokonam",
        imgSrc: "short-sword.png",
        class: 'cleric'
      }
    }
  ],
  chest: [
    {
      
      itemModel: {
        id: 301,
        type: {
          id: 3,
          type: "chest"
        },
        name: "Skórzana kurta",
        fluff: "Lale za takimi szaleją",
        imgSrc: "leather-jerkin.png",
        class: 'any'
      }
    },
    {
      
      itemModel: {
        id: 302,
        type: {
          id: 3,
          type: "chest"
        },
        name: "Sutanna bojowa",
        fluff: "Wiadomo, kto jest kierownikiem tej plebanii",
        imgSrc: "leather-jerkin.png",
        class: 'cleric'
      }
    }
  ],
  legs: [
    {
      
      itemModel: {
        id: 401,
        type: {
          id: 4,
          type: "legs"
        },
        name: "Lniane spodnie",
        fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
        imgSrc: "linen-trousers.png",
        class: 'any'
      }
    },
    {
      
      itemModel: {
        id: 402,
        type: {
          id: 4,
          type: "legs"
        },
        name: "Nogawice płytowe",
        fluff: "Nie da się w nich klękać do miecza",
        imgSrc: "linen-trousers.png",
        class: 'warrior'
      }
    },
    {
      
      itemModel: {
        id: 403,
        type: {
          id: 4,
          type: "legs"
        },
        name: "Ledżinsy",
        fluff: "Obcisłe jak lubisz",
        imgSrc: "linen-trousers.png",
        class: 'rogue'
      }
    }
  ],
  feet: [
    {
      
      itemModel: {
        id: 501,
        type: {
          id: 5,
          type: "feet"
        },
        name: "Wysokie buty",
        fluff: "Skórzane, wypastowane, lśniące",
        imgSrc: "high-boots.png",
        class: 'any'
      }
    },
    {
      
      itemModel: {
        id: 502,
        type: {
          id: 5,
          type: "feet"
        },
        name: "Kapcie cichobiegi",
        fluff: "+10 do testów skradania na linoleum",
        imgSrc: "high-boots.png",
        class: 'rogue'
      }
    }
  ],
  head: [
    {
     
      itemModel: {
        id: 601,
        type: {
          id: 6,
          type: "head"
        },
        name: "Czapka z piórkiem",
        fluff: "Wesoła kompaniaaaa",
        imgSrc: "feathered-hat.png",
        class: 'any'
      }
    },
    {
     
      itemModel: {
        id: 602,
        type: {
          id: 6,
          type: "head"
        },
        name: "Kaptur czarodzieja",
        fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
        imgSrc: "wizard-coul.png",
        class: 'mage'
      }
    }
  ],
  ring: [
    {
      
      itemModel: {
        id: 701,
        type: {
          id: 7,
          type: "ring"
        },
        name: "Pierścień siły",
        fluff: "Całuj mój sygnet potęgi",
        imgSrc: "strength-ring.png",
        class: 'any'
      }
    }
  ]
}

const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: 2.5rem;
  width: 10rem;
  margin: 2rem 0;
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

const AmuletIcon = styled.img`
  width: 32px;
`;

const AmuletList = styled(List)`
max-height: 30vh;
max-width: 30vw;
overflow-y: auto;
border: 1px solid grey;
`

const itemClasses = ['Wojownik', 'Mag', 'Łotrzyk', 'Kleryk']

class NewEventCreator extends Component {
  state = {
    name: '',
    description: '',
    icon: "",
    class: undefined,
    showNewPerkModal: false,
    perks: []
  };



  handleActivationDateChange = date => {
    this.setState({ activationDate: date });
  };

  handlePartySizeSliderChange = (event, newValue) => {
    this.setState({ partySize: newValue });
  };

  handleChangeAmuletQuantity = (e, id) => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel.id === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity = parseInt(e.target.value);
      this.setState({ amulets });
    }
  };

  handleSubtractAmulet = id => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel.id === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity -= 1;

      this.setState({ amulets });
    }
  };

  handleDeleteAmulet = id => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel.id === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity = 0;

      this.setState({ amulets });
    }
  };

  handleAddAmulet = id => {
    const amulets = [...this.state.amulets];
    const idOfAmuletAlreadyAdded = amulets.findIndex(
      amulet => amulet.itemModel.id === id
    );
    if (idOfAmuletAlreadyAdded !== -1) {
      amulets[idOfAmuletAlreadyAdded].quantity += 1;
    }

    this.setState({ amulets });
  };

  handleToggleNewPerkModal = e => {
    this.setState(prevState => {
      return { showNewPerkModal: !prevState.showNewPerkModal };
    });
  };

  handleIconChange = e => {
    this.setState({ icon: URL.createObjectURL(e.target.files[0]) });
  };

  handleToggleClassItem = e => {
    
    this.setState(prevState => {
      return { classItem: !prevState.classItem,
                class: prevState.class ? undefined : itemClasses[0]
             };
    });
  };

  handleChangeNameValue = (e) => {
    const name = e.target.name
    const value = e.target.value 
    this.setState({
        [name]: value
    })
  };

  handleSubmit = () => {
    //valdidate and send data
    this.props.handleClose();
  };

  componentDidUpdate(){
      console.log(this.state.class)
  }

  render() {
    //let amuletListEmpty = this.state.amulets.filter(amulet => amulet.quantity > 0).length == 0
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button>{"< Powrót do panelu przedmiotów"}</Button>
        <Container>
          
          <TextField
            autoFocus
            name="name"
            margin="dense"
            label={`Nazwa przedmiotu`}
            type="text"
            fullWidth
            onChange={this.handleChangeNameValue}
          />
          <TextField
            name="description"
            margin="dense"
            label={`Opis przedmiotu`}
            type="text"
            fullWidth
            multiline
            rows={2}
            rowsMax={5}
            onChange={this.handleChangeNameValue}
          />
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
          <Typography style={{textAlign: 'left'}}>Przeznaczenie:</Typography>
          <Grid container spacing={2}>
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Ogólne</Grid>
                <Grid item>
                    <Switch
                        checked={this.state.classItem}
                        onChange={this.handleToggleClassItem}
                    />
                </Grid>
                <Grid item>Klasowe</Grid>
                </Grid>
            </Typography>
            </Grid>
            <Grid container spacing={2}>
            {this.state.classItem ? (
                <FormControl >
                    <InputLabel htmlFor="class">Klasa</InputLabel>
                    <Select
                        value={this.state.class}
                        onChange={this.handleChangeNameValue}
                        inputProps={{
                            name: 'class',
                            id: 'class',
                        }}
                    >
                        {itemClasses.map((itemClass) => {
                            return (
                                <MenuItem value={itemClass}>{itemClass}</MenuItem>
                            )
                        })}
                    </Select>
              </FormControl>
            ) : (
                null
            )}
          </Grid>
          
          {this.state.perks.length ? (
              <Grid container spacing={2}>
                <List dense>
                    {this.state.perks.map((perk) => {
                        return(
                            <ListItem>{perk.name}</ListItem>
                        )
                    })}
                </List>
                </Grid>
            ):(
                null
            )
          }
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleToggleNewPerkModal}
              >
                {this.state.perks.length ? 'Dodaj kolejny efekt przedmiotu' : 'Dodaj efekt przedmiotu'}
              </Button>
            </Grid>
          </Grid>
          <NewPerkModal
            open={this.state.showNewPerkModal}
            handleClose={this.handleToggleNewPerkModal}
            amuletList={mockAmulets}
            eventAmuletsList={this.state.amulets}
            handleAddAmulet={this.handleAddAmulet}
            handleSubtractAmulet={this.handleSubtractAmulet}
            handleDeleteAmulet={this.handleDeleteAmulet}
            handleChangeAmuletQuantity={this.handleChangeAmuletQuantity}
          />
          {/*(!amuletListEmpty > 0 && !this.state.showNewPerkModal) &&
          <AmuletList dense>
            {this.state.amulets
              .filter(amulet => amulet.quantity > 0)
              .map(amulet => {
                return (
                  <ListItem key={amulet.itemModel.id}>
                    <ListItemAvatar>
                      <img
                        src={require("../../../assets/icons/items/" +
                          amulet.itemModel.imgSrc)}
                        width="64px"
                      />
                    </ListItemAvatar>
                    <ListItemText primary={amulet.itemModel.name} secondary={'x'+amulet.quantity}/>
                  </ListItem>
                );
              })}
          </AmuletList>
          
            */}

          

          
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewEventCreator;
