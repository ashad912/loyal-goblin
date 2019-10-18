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
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import AmuletsModal from "./AmuletsModal";

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
        class: "warrior"
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
        class: "mage"
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
        class: "any"
      }
    }
  ]
};

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

const AmuletIcon = styled.img`
  width: 32px;
`;

const AmuletList = styled(List)`
  max-height: 30vh;
  max-width: 30vw;
  overflow-y: auto;
  border: 1px solid grey;
`;

class NewEventCreator extends Component {
  state = {
    isRaid: false,
    icon: "",
    showAmuletsModal: false,
    amulets: [...mockAmulets],
    partySize: [1, 5],
    isInstant: false,
    activationDate: moment().format("YYYY-MM-DDTHH:mm"),
    endDate: moment()
      .add(1, "d")
      .format("YYYY-MM-DDTHH:mm"),
    isPermanent: false,
    isUnique: false
  };

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

  handleToggleAmuletsModal = e => {
    this.setState(prevState => {
      return { showAmuletsModal: !prevState.showAmuletsModal };
    });
  };

  handleIconChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ icon: URL.createObjectURL(e.target.files[0]) });
    }
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
      this.state.amulets.filter(amulet => amulet.quantity > 0).length == 0;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Button>{"< Powrót do panelu misji"}</Button>
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
                autoFocus
                margin="dense"
                label={`Nazwa ${this.state.isRaid ? "rajdu" : "misji"}`}
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Minimalny poziom"
                type="number"
                inputProps={{ min: "1" }}
              />
            </Grid>
          </Grid>
          <TextField
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
              <img src={this.state.icon} style={{ width: "64px" }} />
            </Grid>
          </Grid>
          <Typography style={{ marginBottom: "3rem", textAlign: "left" }}>
            Wielkość drużyny:
          </Typography>
          <Slider
            value={this.state.partySize}
            onChange={this.handlePartySizeSliderChange}
            valueLabelDisplay="on"
            max={20}
            min={1}
          />
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
            amuletList={mockAmulets}
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
                margin="dense"
                label="Punkty doświadczenia"
                type="number"
                inputProps={{ min: "0" }}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary">
                Dodaj przedmioty
              </Button>
            </Grid>
          </Grid>
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
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewEventCreator;
