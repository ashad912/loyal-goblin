import React, { Component } from "react";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import EventMissionListItem from "../components/EventMissionListItem";

import NewEventCreator from "../components/NewEventCreator";

import "moment/locale/pl";
import EventRallyListItem from "../components/EventRallyListItem";
moment.locale("pl");

const mockEvents = [
  {
    id: 1,
    status: "ready",
    unique: false,
    title: "Wyprawa po minerał fiuta",
    minLevel: 5,
    description: "Dalej dalej po minerał fiutaa",
    imgSrc: "mission-icon.png",
    minPlayers: 2,
    maxPlayers: 6,
    strength: 5,
    dexterity: 4,
    magic: 10,
    endurance: 3, 
    amulets: [
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
        quantity: 1
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
        quantity: 1
      }
    ],
    items: {
      any: [
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
          },
          quantity: 2
        }
      ],
      warrior: [
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
          },
          quantity: 1
        }
      ]
    },
    experience: 2000,
    activationDate: "2019-10-21T19:00",
    expiryDate: "2019-10-21T24:00",
    isPermanent: false,
    awardsAreSecret: false
  },
  {
    id: 2,
    status: "active",
    unique: false,
    title: "Wycieczka z przewodnikiem po grocie Twojej Starej",
    minLevel: 5,
    description: "Echo echo echo...",
    imgSrc: "mission-icon.png",
    minPlayers: 3,
    maxPlayers: 8,
    strength: 15,
    dexterity: 14,
    magic: 11,
    endurance: 31, 
    amulets: [
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
        quantity: 1
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
        quantity: 1
      }
    ],
    items: {
      any: [
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
          },
          quantity: 2
        }
      ],
      warrior: [
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
          },
          quantity: 1
        }
      ]
    },
    experience: 5000,
    activationDate: "2019-10-21T19:00",
    expiryDate: "2019-10-21T24:00",
    isPermanent: false,
    awardsAreSecret: true
  },
  {
    id: 3,
    status: "ready",
  title: "Rajd test",
  description: "Idziemy na rajd",
  imgSrc: "mission-icon.png",
  awardsLevels: [
    {
      level: 200,
      awards: {
        any: [
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
            },
            quantity: 2
          }
        ],
        warrior: [
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
            },
            quantity: 1
          }
        ]
      } 
    },
    {
      level: 2000,
      awards: {
        any: [
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
            },
            quantity: 2
          }
        ],
        warrior: [
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
            },
            quantity: 1
          }
        ]
      } 
    }
  ],
  experience: 500,
  activationDate: "2019-10-21T19:00",
  startDate: "2019-10-22T19:00",
  expiryDate: "2019-10-23T00:00",
  awardsAreSecret: false
}
];

class AdminMissions extends Component {
  state = {
    showNewEventCreator: "",
    fullEventList: [],
    events: [],
    typeFilter: "all",
    statusFilter: "all",
    nameFilter: "",
    showActivateNowDialog: false,
    currentEvent: null,
    changeEndDate: false,
    endDate: ""
  };
  // const [showNewEventCreator, setShowNewEventCreator] = React.useState("");
  // const [events, setEvents] = React.useState(mockEvents);
  // const [typeFilter, setTypeFilter] = React.useState("all")
  // const [statusFilter, setStatusFilter] = React.useState("all");
  // const [nameFilter, setNameFilter] = React.useState("");
  // const [showActivateNowDialog, setShowActivateNowDialog] = React.useState(
  //   false
  // );
  // const [currentEvent, setCurrentEvent] = React.useState(null);
  // const [changeEndDate, setChangeEndDate] = React.useState(false);
  // const [endDate, setEndDate] = React.useState("");

  componentDidMount() {
    //fetch all events
    this.setState({ fullEventList: [...mockEvents], events: [...mockEvents] });
  }

  toggleChangeEndDate = () => {
    this.setState(prevState => {
      return { changeEndDate: !prevState.changeEndDate };
    });
  };

  handleEndDateChange = e => {
    if (moment(e.target.value).isSameOrBefore(moment())) {
      return;
    } else {
      this.setState({ endDate: e.target.value });
    }
  };

  handleHideActivateNowDialog = () => {
    this.setState({ showActivateNowDialog: false });
  };

  handleShowActivateNowDialog = id => {
    this.setState({ showActivateNowDialog: false, currentEvent: id });
  };

  handleEditEventCreator = id => {
    this.setState({ currentEvent: id, showNewEventCreator: "edit" });
  };

  handleNewEventCreator = e => {
    this.setState({ showNewEventCreator: "new" });
  };

  handleCloseEventCreator = e => {
    this.setState({ showNewEventCreator: "" });
  };

  handleActivateNow = () => {
    const tempEvents = [...this.state.events];
    const eventIndex = tempEvents.findIndex(
      event => event.id === this.state.currentEvent
    );
    tempEvents[eventIndex].activationDate = moment().format("YYYY-MM-DDTHH:mm");
    if (this.state.changeEndDate && this.state.endDate) {
      tempEvents[eventIndex].expiryDate = moment(this.state.endDate).format(
        "YYYY-MM-DDTHH:mm"
      );
      tempEvents[eventIndex].status ="active"
    }
    this.setState(
      {
        events: [...tempEvents],
        changeEndDate: false,
        endDate: "",
        currentEvent: null
      },
      () => {
        this.handleHideActivateNowDialog();
      }
    );
  };

  handleDeleteEvent = id => {
    this.setState({
      events: this.state.events.filter(event => event.id !== id)
    });
  };

  handleArchiveEvent = id => {
    const tempEvents = [...this.state.events]
    const idToArchive = tempEvents.findIndex(event => event.id === id)
    tempEvents[idToArchive].status = "archive"
    this.setState({events: [...tempEvents]})
    
  };

  handleChangeNameFilter = e => {
    const nameFilter = e.target.value.trim();
    this.setState({ nameFilter }, () => {
      this.applyFilters()
    });
  };

  

  handleChangeStatusFilter = e => {
    const status = e.target.value;
    this.setState({ statusFilter: status }, () => {
      this.applyFilters()
    });
  };


  handleChangeTypeFiler = e => {
    const type = e.target.value;
    this.setState({ typeFilter: type }, () => {
      this.applyFilters()
    });
  };

  applyFilters = () => {
    let tempEvents = [...this.state.fullEventList];
    switch (this.state.typeFilter) {
      case "all":
        break;
      case "mission":
        tempEvents = tempEvents.filter(event => event.hasOwnProperty('minLevel') );
        break;
      case "rally":
        tempEvents = tempEvents.filter(event => !event.hasOwnProperty('minLevel') );

        break;
      
      default:
        break;
    }
    switch (this.state.statusFilter) {
      case "all":
        break;
      case "active":
        tempEvents = tempEvents.filter(event => event.status === "active");
        break;
      case "ready":
        tempEvents = tempEvents.filter(event => event.status === "ready");

        break;
      case "ended":
        tempEvents = tempEvents.filter(event => event.status === "ended");
        break;
      case "archive":
        tempEvents = tempEvents.filter(event => event.status === "archive");
        break;
      default:
        break;
    }
    if (this.state.nameFilter.length > 0) {
      tempEvents = tempEvents.filter(
        event => event.title.toLowerCase().search(this.state.nameFilter) !== -1
      );
    }
    this.setState({ events: [...tempEvents] });
  }

  render() {
    return (
      <div>
        {this.state.showNewEventCreator ? (
          <NewEventCreator
            open={this.state.showNewEventCreator}
            handleClose={this.handleCloseEventCreator}
            isEdit={this.state.showNewEventCreator === "edit"}
            eventToEdit={
              this.state.showNewEventCreator === "edit"
                ? this.state.events.find(event => event.id === this.state.currentEvent)
                : null
            }
          />
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNewEventCreator}
            >
              Stwórz nowe wydarzenie
            </Button>
            <Typography variant="h5" style={{ marginTop: "2rem" }}>
              Lista wydarzeń
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
                <FormControl style={{ alignSelf: "flex-start", minWidth: '10vw' }}>
                  <InputLabel htmlFor="type-filter">
                    Rodzaj wydarzenia
                  </InputLabel>
                  <Select
                    value={this.state.typeFilter}
                    onChange={this.handleChangeTypeFiler}
                    inputProps={{
                      id: "type-filter"
                    }}
                  >
                    <MenuItem value={"all"}>Wszystkie</MenuItem>
                    <MenuItem value={"mission"}>Misja</MenuItem>
                    <MenuItem value={"rally"}>Rajd</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ alignSelf: "flex-start" }}>
                  <InputLabel htmlFor="status-filter">Status</InputLabel>
                  <Select
                    value={this.state.statusFilter}
                    onChange={this.handleChangeStatusFilter}
                    inputProps={{
                      id: "status-filter"
                    }}
                  >
                    <MenuItem value={"all"}>Wszystkie</MenuItem>
                    <MenuItem value={"active"}>Aktywne</MenuItem>
                    <MenuItem value={"ready"}>Oczekujące</MenuItem>
                    <MenuItem value={"ended"}>Zakończone</MenuItem>
                    <MenuItem value={"archive"}>Zarchiwizowane</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  value={this.state.nameFilter}
                  onChange={this.handleChangeNameFilter}
                  margin="dense"
                  label="Szukaj nazwy wydarzenia"
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

            {this.state.events.length > 0 && (
              <List
                style={{
                  width: "70%",
                  border: "1px solid grey",
                  margin: "0 auto"
                }}
              >
                {this.state.events.map((event, index) => {
                  return (
                    event.hasOwnProperty("minLevel") ? 

                    <EventMissionListItem
                      key={event.id}
                      isLast={this.state.events.length - 1 === index}
                      event={event}
                      activateNow={this.handleShowActivateNowDialog}
                      editEvent={this.handleEditEventCreator}
                      deleteEvent={this.handleDeleteEvent}
                      archiveEvent={this.handleArchiveEvent}
                      active={event.status === "active"}
                    />
                    :
                    <EventRallyListItem 
                    key={event.id}
                    isLast={this.state.events.length - 1 === index}
                    event={event}
                    activateNow={this.handleShowActivateNowDialog}
                    editEvent={this.handleEditEventCreator}
                    deleteEvent={this.handleDeleteEvent}
                    archiveEvent={this.handleArchiveEvent}
                    active={event.status === "active"}
                    />
                  );
                })}
              </List>
            )}
          </div>
        )}
        {this.state.currentEvent && (
          <Dialog
            open={this.state.showActivateNowDialog}
            onClose={this.handleHideActivateNowDialog}
          >
            <DialogTitle>
              Opublikuj wydarzenie{" "}
              {this.state.events.find(event => event.id === this.state.currentEvent).name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Wydarzenie zostanie opublikowane{" "}
                {moment().format("YYYY-MM-DD, HH:mm")}.
              </DialogContentText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.changeEndDate}
                    onChange={this.toggleChangeEndDate}
                  />
                }
                label="Zmienić datę zakończenia?"
              />
              {this.state.changeEndDate && (
                <React.Fragment>
                  <Typography>Czas zakończenia wydarzenia: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.endDate}
                    onChange={this.handleEndDateChange}
                  />
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleHideActivateNowDialog} color="secondary">
                Anuluj
              </Button>
              <Button onClick={this.handleActivateNow} color="primary">
                Zatwierdź
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  }
}

export default AdminMissions;
