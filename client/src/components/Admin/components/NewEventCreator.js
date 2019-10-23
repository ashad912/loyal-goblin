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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import AttributeBox from './AttributeBox'
import AmuletsModal from "./AmuletsModal";

import diamondAmulet from "../../../assets/icons/items/diamond-amulet.png";
import sapphireAmulet from "../../../assets/icons/items/sapphire-amulet.png";
import pearlAmulet from "../../../assets/icons/items/pearl-amulet.png";
import emeraldAmulet from "../../../assets/icons/items/emerald-amulet.png";

import characterClasses from "../../../assets/categories/characterClasses";

import "moment/locale/pl";
import ItemsModal from "./ItemsModal";
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
        class: "any"
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
        class: "any"
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
        class: "any"
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
        class: "warrior",
        perks: [
          {
            perkType: "attr-strength",
            target: undefined,
            time: [],
            value: "+1"
          }
        ]
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
        class: "mage"
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
        class: "rogue"
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
        class: "cleric"
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
        class: "any"
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
        class: "cleric"
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
        class: "any"
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
        class: "warrior"
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
        class: "rogue"
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
        class: "any"
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
        class: "rogue"
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
        class: "any"
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
      }
    }
  ]
};

const FileInputWrapper = styled.div`
  position: relative;
  background: red;
  height: 2.5rem;
  width: 14rem;
  margin: 2rem 0;
`;

const HiddenFileInput = styled(Input)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 2.5rem;
  width: 14rem;
  user-select: none;
`;

const FileInputButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  height: 2.5rem;
  width: 14rem;
`;

class NewEventCreator extends Component {
  state = {
    isRaid: false,
    isUnique: false,
    name: "",
    description: "",
    minLevel: "",
    icon: "",
    partySize: [1, 5],
    attributePool: {str: 1, dex: 1, mag: 1, end: 1},
    showAmuletsModal: false,
    amulets: [...mockAmulets],
    showItemsModal: false,
    experience: 0,
    prizesAreSecret: false,
    items: { any: [], warrior: [], mage: [], rogue: [], cleric: [] },
    activationDate: moment().format("YYYY-MM-DDTHH:mm"),
    isInstant: false,
    endDate: moment()
      .add(1, "d")
      .format("YYYY-MM-DDTHH:mm"),
    isPermanent: false
  };

  componentDidMount() {
    if (this.props.isEdit) {
      const event = { ...this.props.eventToEdit };
      const amulets = mockAmulets.map(amulet => {
        return {
          ...amulet,
          quantity:
            event.amulets.find(
              eventAmulet => eventAmulet.itemModel.id === amulet.itemModel.id
            ) !== undefined
              ? event.amulets.find(
                  eventAmulet =>
                    eventAmulet.itemModel.id === amulet.itemModel.id
                ).quantity
              : 0
        };
      });
      this.setState({
        isRaid: event.isRaid,
        isUnique: event.isUnique,
        name: event.name,
        description: event.description,
        minLevel: event.minLevel,
        icon: event.icon,
        partySize: event.partySize,
        amulets: amulets,
        experience: event.experience,
        items: { any: [], warrior: [], mage: [], rogue: [], cleric: [],...event.items },
        activationDate: moment(event.activationDate.split("T")[0] + " " + event.activationDate.split("T")[1]).format("YYYY-MM-DDTHH:mm"),
        endDate:  moment(event.endDate.split("T")[0] + " " + event.endDate.split("T")[1]).format("YYYY-MM-DDTHH:mm"),
        isPermanent: event.isPermanent
      });
    }
  }

  handleUniqueChange = () => {
    this.setState(prevState => {
      return { isUnique: !prevState.isUnique };
    });
  };

  handleEndDateChange = e => {
    this.setState({ endDate: e.target.value });
  };

  handleActivationDateChange = e => {
    this.setState({ activationDate: e.target.value });
  };

  handlePermanentChange = () => {
    this.setState(prevState => {
      return { isPermanent: !prevState.isPermanent };
    });
  };

  handleInstantChange = () => {
    this.setState(prevState => {
      return { isInstant: !prevState.isInstant };
    });
  };

  handlePartySizeSliderChange = (event, newValue) => {
    this.setState({ partySize: newValue });
  };

  handleChangeItemQuantity = (currentItem, quantity, characterClass) => {
    const allItems = { ...this.state.items };
    const classItems = [...allItems[characterClass]];
    const idOfItem = classItems.findIndex(
      item => item.itemModel.id === currentItem.itemModel.id
    );

    classItems[idOfItem].quantity = parseInt(quantity);

    allItems[characterClass] = classItems;
    this.setState({ items: allItems });
  };

  handleSubtractItem = (currentItem, characterClass) => {
    const allItems = { ...this.state.items };
    let classItems = [...allItems[characterClass]];
    const idOfItem = classItems.findIndex(
      item => item.itemModel.id === currentItem.itemModel.id
    );

    classItems[idOfItem].quantity -= 1;
    if (classItems[idOfItem].quantity === 0) {
      classItems.splice(idOfItem, 1);
    }
    allItems[characterClass] = classItems;
    this.setState({ items: allItems });
  };

  handleAddItem = (currentItem, characterClass) => {
    const allItems = { ...this.state.items };
    const classItems = [...allItems[characterClass]];
    const idOfItemAlreadyAdded = classItems.findIndex(
      item => item.itemModel.id === currentItem.itemModel.id
    );
    if (idOfItemAlreadyAdded === -1) {
      classItems.push({ ...currentItem, quantity: 1 });
    } else {
      classItems[idOfItemAlreadyAdded].quantity += 1;
    }
    allItems[characterClass] = classItems;
    this.setState({ items: allItems });
  };

  handleChangeExperience = (e) => {
    this.setState({experience: e.target.value})
  }

  handleChangeAmuletQuantity = (id, quantity) => {
    const amulets = [...this.state.amulets];
    const idOfAmulet = amulets.findIndex(amulet => amulet.itemModel.id === id);
    if (idOfAmulet !== -1) {
      amulets[idOfAmulet].quantity = parseInt(quantity);
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

  handleToggleItemsModal = e => {
    this.setState(prevState => {
      return { showItemsModal: !prevState.showItemsModal };
    });
  };

  handleToggleAmuletsModal = e => {
    this.setState(prevState => {
      return { showAmuletsModal: !prevState.showAmuletsModal };
    });
  };

  handleChangeAttributeValue = (e, attr, n) => {
    const attributes = {...this.state.attributePool}
    if(n){
      attributes[attr] += n
    }else{
      if(/^\d+$/.test(e.target.value)){
        attributes[attr] = parseInt(e.target.value)
      }
    }
    this.setState({attributePool: attributes})
  }

  handleIconChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ icon: URL.createObjectURL(e.target.files[0]) });
    }
  };

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value.trim() });
  };

  handleMinLevelChange = e => {
    this.setState({ minLevel: e.target.value.trim() });
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value.trim() });
  };

  handleToggleRaid = e => {
    this.setState(prevState => {
      return { isRaid: !prevState.isRaid };
    });
  };

  handleSubmit = () => {
    //valdidate and send data
    this.props.handleClose();
  };

  render() {
    let amuletListEmpty =
      this.state.amulets.filter(amulet => amulet.quantity > 0).length === 0;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button onClick={this.props.handleClose}>
          {"< Powrót do panelu misji"}
        </Button>
        <Container>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>Misja</Grid>
              <Grid item>
                <Switch
                  checked={this.state.isRaid}
                  onChange={this.handleToggleRaid}
                />
              </Grid>
              <Grid item>Rajd</Grid>
              <Grid item>
                <FormControlLabel
                  style={{ marginLeft: "4rem" }}
                  control={
                    <Checkbox
                      checked={this.state.isUnique}
                      onChange={this.handleUniqueChange}
                    />
                  }
                  label="Wydarzenie unikalne"
                />
              </Grid>
            </Grid>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                value={this.state.name}
                onChange={this.handleNameChange}
                autoFocus
                margin="dense"
                label={`Nazwa ${this.state.isRaid ? "rajdu" : "misji"}`}
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={this.state.minLevel}
                onChange={this.handleMinLevelChange}
                margin="dense"
                label="Minimalny poziom"
                type="number"
                inputProps={{ min: "1" }}
              />
            </Grid>
          </Grid>
          <TextField
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            margin="dense"
            label={`Opis ${this.state.isRaid ? "rajdu" : "misji"}`}
            type="text"
            fullWidth
            multiline
            rows={2}
            rowsMax={5}
          />
          <Grid container spacing={2}>
            <Grid item>
              <FileInputWrapper>
                <FileInputButton variant="contained" color="primary">
                  {this.state.icon ? "Zmień ikonę" : "Dodaj ikonę"}{" "}
                  {this.state.isRaid ? " rajdu" : " misji"}
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
              {this.state.icon && (
                <img
                  src={
                    this.state.icon.startsWith("blob")
                      ? this.state.icon
                      : require("../../../assets/icons/events/" +
                          this.state.icon)
                  }
                  style={{ width: "64px" }}
                />
              )}
            </Grid>
          </Grid>
          <Typography style={{ marginBottom: "3rem", textAlign: "left" }}>
            Wielkość drużyny:
          </Typography>
          <Slider
            value={this.state.partySize}
            onChange={this.handlePartySizeSliderChange}
            valueLabelDisplay="on"
            min={1}
            max={8}
          />
          <Divider style={{ marginTop: "2rem", marginBottom: "1rem" }} />
          <div>
            <Typography style={{width: 'fit-content', margin: '1rem 0'}}>Wymagane wartości atrybutów:</Typography>
          <AttributeBox value={this.state.attributePool.str} attrType="str" attrTypeText="Siła" changeValue={this.handleChangeAttributeValue}/>
          <AttributeBox value={this.state.attributePool.dex} attrType="dex" attrTypeText="Zręczność" changeValue={this.handleChangeAttributeValue}/>
          <AttributeBox value={this.state.attributePool.mag} attrType="mag" attrTypeText="Magia" changeValue={this.handleChangeAttributeValue}/>
          <AttributeBox value={this.state.attributePool.end} attrType="end" attrTypeText="Wytrzymałość" changeValue={this.handleChangeAttributeValue}/>

          </div>
          <Divider style={{ marginTop: "2rem", marginBottom: "1rem" }} />
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleToggleAmuletsModal}
                style={{ marginBottom: "1rem" }}
              >
                {amuletListEmpty
                  ? "Dodaj wymagane amulety"
                  : "Edytuj wymagane amulety"}
              </Button>
            </Grid>
          </Grid>


          <AmuletsModal
            open={this.state.showAmuletsModal}
            handleClose={this.handleToggleAmuletsModal}
            amuletList={this.props.isEdit ? this.state.amulets : mockAmulets}
            eventAmuletsList={this.state.amulets}
            handleAddAmulet={this.handleAddAmulet}
            handleSubtractAmulet={this.handleSubtractAmulet}
            handleDeleteAmulet={this.handleDeleteAmulet}
            handleChangeAmuletQuantity={this.handleChangeAmuletQuantity}
          />
          {!amuletListEmpty > 0 && !this.state.showAmuletsModal && (
            <Grid
              spacing={2}
              style={{ width: "100%" }}
              direction="row"
              container
              alignItems="flex-end"
            >
              {this.state.amulets
                .filter(amulet => amulet.quantity > 0)
                .map(amulet => {
                  return (
                    <Grid item key={amulet.itemModel.id}>
                      <ListItemAvatar>
                        <img
                          src={require("../../../assets/icons/items/" +
                            amulet.itemModel.imgSrc)}
                          width="64px"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={amulet.itemModel.name}
                        secondary={"x" + amulet.quantity}
                        style={{ marginLeft: "1rem" }}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          )}
                   
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Typography style={{ textAlign: "left" }}>Nagrody:</Typography>
          <Grid
            container
            direction="column"
            spacing={2}
            alignItems="flex-start"
          >
            <Grid item>
              <TextField
              value={this.state.experience}
              onChange={this.handleChangeExperience}
                margin="dense"
                label="Punkty doświadczenia"
                type="number"
                inputProps={{ min: "0", step: "50" }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleToggleItemsModal}
              >
                Dodaj przedmioty
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
              {this.state.items.any.length > 0 && (
                <div
                  style={{
                    overflow: "auto",
                    borderRight: "1px solid grey",
                    flexBasis: "50%"
                  }}
                >
                  <Typography style={{ fontWeight: "bolder" }}>
                    Wszystkie klasy
                  </Typography>
                  <List dense>
                    {this.state.items.any.map(item => {
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
                  </List>
                </div>
              )}
              <div style={{ overflow: "auto", flexBasis: "50%" }}>
                <List dense>
                  {Object.keys(this.state.items)
                    .filter(
                      characterClass =>
                        characterClass !== "any" &&
                        this.state.items[characterClass].length > 0
                    )
                    .map(characterClass => {
                      return (
                        <React.Fragment>
                          <Typography style={{ fontWeight: "bolder" }}>
                            {characterClasses[characterClass]}
                          </Typography>
                          {this.state.items[characterClass].map(item => {
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
              </div>
            </div>
          )}
          <ItemsModal
            open={this.state.showItemsModal}
            handleClose={this.handleToggleItemsModal}
            itemsList={mockItems}
            eventItemsList={this.state.items}
            handleAddItem={this.handleAddItem}
            handleSubtractItem={this.handleSubtractItem}
            handleChangeItemQuantity={this.handleChangeItemQuantity}
          />
          <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
          <Grid
            container
            justify="space-around"
            direction="column"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item style={{ textAlign: "left" }}>
              {!this.state.isInstant && (
                <React.Fragment>
                  <Typography>Czas publikacji wydarzenia: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.activationDate}
                    onChange={this.handleActivationDateChange}
                  />
                </React.Fragment>
              )}
              <FormControlLabel
                style={{ marginLeft: "2rem" }}
                control={
                  <Checkbox
                    checked={this.state.isInstant}
                    onChange={this.handleInstantChange}
                  />
                }
                label="Publikuj natychmiast"
              />
            </Grid>
            <Grid item style={{ textAlign: "left" }}>
              {!this.state.isPermanent && (
                <React.Fragment>
                  <Typography>Czas zakończenia wydarzenia: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.endDate}
                    onChange={this.handleEndDateChange}
                  />
                </React.Fragment>
              )}
              <FormControlLabel
                style={{ marginLeft: "2rem" }}
                control={
                  <Checkbox
                    checked={this.state.isPermanent}
                    onChange={this.handlePermanentChange}
                  />
                }
                label="Wydarzenie bezterminowe"
              />
            </Grid>
          </Grid>
          <Grid
            container
            justify="center"
            spacing={5}
            style={{ marginTop: "2rem" }}
          >
            <Grid item>
              <Button onClick={this.props.handleClose} color="secondary">
                Anuluj
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.props.handleClose}
                color="primary"
                variant="contained"
              >
                {this.props.isEdit ? "Zatwierdź edycję wydarzenia" : "Dodaj wydarzenie"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewEventCreator;
