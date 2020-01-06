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
import {
  getEvents,
  getRallies,
  updateEvent
} from "../../../store/adminActions/eventActions";
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
    expiryDate: "2019-10-21T00:00",
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
    expiryDate: "2019-10-21T00:00",
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
    currentEvent: null,
    currentEventIsRally: false,
    showActivateNowDialog: false,
    activationDate: moment().format("YYYY-MM-DDTHH:mm"),
    changeStartDate: false,
    startDate: moment()
      .add(1, "d")
      .format("YYYY-MM-DDTHH:mm"),
    changeExpiryDate: false,
    expiryDate: moment()
      .add(2, "d")
      .format("YYYY-MM-DDTHH:mm"),
    dateErrors: {
      activationDate: ["", ""],
      startDate: ["", ""],
      expiryDate: ["", ""]
    },
    disableEventDateChange: true,
    awaitingRallyList: false,
    collisionRallyList: []
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
  // const [changeexpiryDate, setChangeexpiryDate] = React.useState(false);
  // const [expiryDate, setexpiryDate] = React.useState("");

  fetchEvents = async () => {
    const events = await getEvents();
    this.setState({ fullEventList: [...events], events: [...events] });
  };

  componentDidMount() {
    this.fetchEvents();
  }

  handleValidateDates = (value, type) => {
    const isRally = this.state.currentEventIsRally;
    const event = {
      activationDate: moment(this.state.activationDate),
      startDate: isRally ? moment(this.state.startDate) : null,
      expiryDate: moment(this.state.expiryDate)
    };

    event[type] = moment(value);

    const errors = { ...this.state.dateErrors };

    const newEventActivation = event.activationDate.valueOf();
    const newEventStart = isRally ? event.startDate.valueOf() : null;
    const newEventEnd = event.expiryDate.valueOf();

    switch (type) {
      case "activationDate":
        if (newEventActivation >= newEventEnd) {
          errors.activationDate[0] =
            "Czas publikacji nie może być późniejszy niż czas zakończenia";
        } else {
          errors.activationDate[0] = "";
        }
        if (isRally && newEventActivation >= newEventStart) {
          errors.activationDate[1] =
            "Czas publikacji nie może być późniejszy niż czas rozpoczęcia";
        } else {
          errors.activationDate[1] = "";
        }

        break;
      case "startDate":
        if (newEventStart < newEventActivation) {
          errors.startDate[0] =
            "Czas rozpoczęcia nie może być wcześniejszy niż czas publikacji";
        } else {
          errors.startDate[0] = "";
        }
        if (newEventStart >= newEventEnd) {
          errors.startDate[1] =
            "Czas rozpoczęcia nie może być późniejszy niż czas zakończenia";
        } else {
          errors.startDate[1] = "";
        }
        break;

      case "expiryDate":
        if (newEventEnd <= newEventActivation) {
          errors.expiryDate[0] =
            "Czas zakończenia nie może być wcześniejszy niż czas publikacji";
        } else {
          errors.expiryDate[0] = "";
        }
        if (isRally && newEventEnd <= newEventStart) {
          errors.expiryDate[1] =
            "Czas zakończenia nie może być wcześniejszy niż czas rozpoczęcia";
        } else {
          errors.expiryDate[1] = "";
        }
        break;

      default:
        break;
    }

    if (
      Object.values(errors)
        .reduce((a, b) => a.concat(b))
        .every(error => error === "")
    ) {
      return { value, errors };
    } else {
      return { value: null, errors };
    }
  };

  toggleChangeStartDate = () => {
    this.setState(prevState => {
      return { changeStartDate: !prevState.changeStartDate };
    });
  };

  toggleChangeExpiryDate = () => {
    this.setState(prevState => {
      return { changeExpiryDate: !prevState.changeExpiryDate };
    });
  };

  handleExpiryDateChange = e => {
    const result = this.handleValidateDates(e.target.value, "expiryDate");

    this.setState(
      prevState => {
        return {
          expiryDate: result.value ? result.value : prevState.expiryDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        this.handleCheckDateErrors();
      }
    );
  };

  handleStartDateChange = e => {
    const result = this.handleValidateDates(e.target.value, "startDate");

    this.setState(
      prevState => {
        return {
          startDate: result.value ? result.value : prevState.startDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        this.handleCheckDateErrors();
      }
    );
  };

  handleCheckRallyDates = () => {
    if (
      this.state.activationDate &&
      this.state.expiryDate &&
      this.state.startDate
    ) {
      this.setState({ awaitingRallyList: true }, async () => {
        const rallyList = await getRallies();

        const rally = {
          activationDate: moment(this.state.activationDate),
          expiryDate: moment(this.state.expiryDate)
        };

        const newRallyActivation = rally.activationDate.valueOf();
        const newRallyEnd = rally.expiryDate.valueOf();

        let causingRallyList = [];
        rallyList.forEach(rallyItem => {
          if (rallyItem._id === this.state.currentEvent) {
            return;
          }
          const existingRallyActiviation = moment(rallyItem.activationDate).valueOf();
          const existingRallyEnd = moment(rallyItem.expiryDate).valueOf();

          if (
            !(
              (existingRallyActiviation < newRallyActivation &&
                existingRallyEnd < newRallyActivation) ||
              (existingRallyEnd > newRallyEnd &&
                existingRallyActiviation > newRallyEnd)
            )
          ) {
            causingRallyList = [...causingRallyList, rallyItem]; //assembling list of 'bad' rallies :<<
          }
        });

        if (causingRallyList.length) {

          this.setState({
            collisionRallyList: [...causingRallyList],
            awaitingRallyList: false,
            disableEventDateChange: true
          });
        } else {
          this.setState({ collisionRallyList: [], awaitingRallyList: false });
        }
      });
    }
  };

  handleCheckDateErrors = () => {
    let dateValidation = Object.values(this.state.dateErrors)
      .reduce((a, b) => a.concat(b))
      .every(error => error === "");

    this.setState({ disableEventDateChange: !dateValidation }, () => {
      if (this.state.currentEventIsRally) {
        this.handleCheckRallyDates();
      }
    });
  };

  handleSetCurrentEvent = (id, cb) => {
    if (id) {
      const isRally = !this.state.events
        .find(event => event._id === id)
        .hasOwnProperty("level");
      this.setState(
        { currentEvent: id, currentEventIsRally: isRally },
        () => cb
      );
    } else {
      this.setState(
        { currentEvent: null, currentEventIsRally: null },
        () => cb
      );
    }
  };

  handleHideActivateNowDialog = () => {
    this.handleSetCurrentEvent(
      null,
      this.setState({
        showActivateNowDialog: false,
        activationDate: "",
        startDate: "",
        expiryDate: "",
        changeStartDate: false,
        changeExpiryDate: false
      })
    );
  };

  handleShowActivateNowDialog = id => {
    this.handleSetCurrentEvent(
      id,
      this.setState({
        showActivateNowDialog: true,
        activationDate: moment().format("YYYY-MM-DDTHH:mm"),
        startDate: moment()
          .add(1, "d")
          .format("YYYY-MM-DDTHH:mm"),
        expiryDate: moment()
          .add(2, "d")
          .format("YYYY-MM-DDTHH:mm")
      })
    );
  };

  handleEditEventCreator = id => {
    this.handleSetCurrentEvent(
      id,
      this.setState({ showNewEventCreator: "edit" })
    );
  };

  handleNewEventCreator = e => {
    this.setState({ showNewEventCreator: "new" });
  };

  handleCloseEventCreator = e => {
    this.fetchEvents();
    this.setState({ showNewEventCreator: "" });
  };

  handleActivateNow = async () => {
    const tempEvents = [...this.state.events];
    const eventIndex = tempEvents.findIndex(
      event => event._id === this.state.currentEvent
    );
    tempEvents[eventIndex].activationDate = this.state.activationDate;

    if (this.state.changeExpiryDate && this.state.expiryDate) {
      tempEvents[eventIndex].expiryDate = moment(this.state.expiryDate).format(
        "YYYY-MM-DDTHH:mm"
      );
    }
    const event = {
      _id: this.state.currentEvent,
      activationDate: tempEvents[eventIndex].activationDate,
      expiryDate: tempEvents[eventIndex].expiryDate
    };
    await updateEvent(
      tempEvents[eventIndex].isRally ? "rally" : "mission",
      event
    );

    this.handleHideActivateNowDialog();
    this.fetchEvents();
  };

  handleDeleteEvent = id => {
    this.setState({
      events: this.state.events.filter(event => event._id !== id)
    });
  };

  handleArchiveEvent = id => {
    const tempEvents = [...this.state.events];
    const idToArchive = tempEvents.findIndex(event => event._id === id);
    tempEvents[idToArchive].status = "archive";
    this.setState({ events: [...tempEvents] });
  };

  handleChangeNameFilter = e => {
    const nameFilter = e.target.value.trim();
    this.setState({ nameFilter }, () => {
      this.applyFilters();
    });
  };

  handleChangeStatusFilter = e => {
    const status = e.target.value;
    this.setState({ statusFilter: status }, () => {
      this.applyFilters();
    });
  };

  handleChangeTypeFiler = e => {
    const type = e.target.value;
    this.setState({ typeFilter: type }, () => {
      this.applyFilters();
    });
  };

  applyFilters = () => {
    let tempEvents = [...this.state.fullEventList];
    switch (this.state.typeFilter) {
      case "all":
        break;
      case "mission":
        tempEvents = tempEvents.filter(event =>
          event.hasOwnProperty("minLevel")
        );
        break;
      case "rally":
        tempEvents = tempEvents.filter(
          event => !event.hasOwnProperty("minLevel")
        );

        break;

      default:
        break;
    }
    switch (this.state.statusFilter) {
      case "all":
        break;
      case "ready":
        tempEvents = tempEvents.filter(event => event.status === "ready");

        break;
      case "active":
        tempEvents = tempEvents.filter(event => event.status === "active");
        break;
      case "running":
        tempEvents = tempEvents.filter(event => event.status === "running");
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
  };

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
                ? this.state.events.find(
                    event => event._id === this.state.currentEvent
                  )
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
                <FormControl
                  style={{ alignSelf: "flex-start", minWidth: "10vw" }}
                >
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
                    <MenuItem value={"ready"}>Oczekujące</MenuItem>
                    <MenuItem value={"active"}>Aktywne</MenuItem>
                    <MenuItem value={"running"}>Uruchomiony rajd</MenuItem>
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
                  return event.hasOwnProperty("level") && event.level ? (
                    <EventMissionListItem
                      key={event._id}
                      isLast={this.state.events.length - 1 === index}
                      event={event}
                      activationDate={moment(event.activationDate).format(
                        "L, LTS"
                      )}
                      expiryDate={moment(event.expiryDate).format("L, LTS")}
                      activateNow={this.handleShowActivateNowDialog}
                      editEvent={this.handleEditEventCreator}
                      deleteEvent={this.handleDeleteEvent}
                      archiveEvent={this.handleArchiveEvent}
                      active={event.status === "active"}
                    />
                  ) : (
                    <EventRallyListItem
                      key={event._id}
                      isLast={this.state.events.length - 1 === index}
                      event={event}
                      activationDate={moment(event.activationDate).format(
                        "L, LTS"
                      )}
                      startDate={moment(event.startDate).format("L, LTS")}
                      expiryDate={moment(event.expiryDate).format("L, LTS")}
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
              {
                this.state.events.find(
                  event => event._id === this.state.currentEvent
                ).name
              }
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Wydarzenie zostanie opublikowane{" "}
                {moment().format("YYYY-MM-DD, HH:mm")}.
              </DialogContentText>
              {this.state.currentEventIsRally && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.changeStartDate}
                      onChange={this.toggleChangeStartDate}
                    />
                  }
                  label="Zmienić datę rozpoczęcia?"
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.changeExpiryDate}
                    onChange={this.toggleChangeExpiryDate}
                  />
                }
                label="Zmienić datę zakończenia?"
              />
              {this.state.currentEventIsRally && this.state.changeStartDate && (
                <React.Fragment>
                  <Typography>Czas rozpoczęcia wydarzenia: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.startDate}
                    onChange={this.handleStartDateChange}
                    style={{ marginBottom: "1rem" }}
                  />
                </React.Fragment>
              )}
              {this.state.changeExpiryDate && (
                <React.Fragment>
                  <Typography>Czas zakończenia wydarzenia: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.expiryDate}
                    onChange={this.handleExpiryDateChange}
                  />
                </React.Fragment>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleHideActivateNowDialog}
                color="secondary"
              >
                Anuluj
              </Button>
              <Button
                onClick={this.handleActivateNow}
                color="primary"
                disabled={this.state.disableEventDateChange}
              >
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
