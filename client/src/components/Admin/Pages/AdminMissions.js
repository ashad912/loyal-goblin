import React from "react";
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

import NewEventCreator from "../components/NewEventCreator";

import "moment/locale/pl";
import EventListItem from "../components/EventListItem";
moment.locale("pl");

const mockEvents = [
  {
    id: 1,
    isRaid: false,
    isUnique: false,
    name: "Wyprawa po minerał fiuta",
    minLevel: 5,
    description: "Dalej dalej po minerał fiutaa",
    icon: "mission-icon.png",
    partySize: [2, 6],
    attributes: {str: 4, dex: 10, mag: 3, end: 5},
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
    activationDate: "2019.10.21T19:00",
    endDate: "2019.10.21T24:00",
    isPermanent: false
  },
  {
    id: 2,
    isRaid: false,
    isUnique: true,
    name: "Wycieczka z przewodnikiem po Grocie Twojej Starej",
    minLevel: 15,
    description: "Echo echo echo...",
    icon: "mission-icon.png",
    partySize: [4, 8],
    attributes: {str: 10, dex: 0, mag: 0, end: 21},
    amulets: [
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
        quantity: 6
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
        quantity: 3
      }
    ],
    items: {
      any: [
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
          },
          quantity: 1
        }
      ],
      cleric: [
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
          },
          quantity: 1
        }
      ],
      rogue: [
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
          },
          quantity: 1
        }
      ]
    },
    experience: 5000,
    activationDate: "2019.10.20T18:00",
    endDate: "2019.10.20T24:00",
    isPermanent: false
  }
];

const AdminMissions = () => {
  const [showNewEventCreator, setShowNewEventCreator] = React.useState("");
  const [events, setEvents] = React.useState(mockEvents);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [nameFilter, setNameFilter] = React.useState("");
  const [showActivateNowDialog, setShowActivateNowDialog] = React.useState(
    false
  );
  const [currentEvent, setCurrentEvent] = React.useState(null);
  const [changeEndDate, setChangeEndDate] = React.useState(false);
  const [endDate, setEndDate] = React.useState("");

  const toggleChangeEndDate = () => {
    setChangeEndDate(prev => !prev);
  };

  const handleEndDateChange = e => {
    if (moment(e.target.value).isSameOrBefore(moment())) {
      return;
    } else {
      setEndDate(e.target.value);
    }
  };

  const handleHideActivateNowDialog = () => {
    setShowActivateNowDialog(false);
  };

  const handleShowActivateNowDialog = id => {
    setShowActivateNowDialog(true);
    setCurrentEvent(id);
  };

  const handleEditEventCreator = id => {
    setCurrentEvent(id);
    setShowNewEventCreator("edit");
  };

  const handleNewEventCreator = e => {
    setShowNewEventCreator("new");
  };

  const handleCloseEventCreator = e => {
    setShowNewEventCreator("");
  };

  const handleActivateNow = () => {
    const tempEvents = [...events];
    const eventIndex = tempEvents.findIndex(event => event.id === currentEvent);
    tempEvents[eventIndex].activationDate = moment().format("YYYY-MM-DDTHH:mm");
    if (changeEndDate && endDate) {
      tempEvents[eventIndex].endDate = moment(endDate).format(
        "YYYY-MM-DDTHH:mm"
      );
    }
    setEvents(tempEvents);
    setChangeEndDate(false);
    setEndDate("");
    setCurrentEvent(null);
    handleHideActivateNowDialog();
  };

  const handleDeleteEvent = id => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleArchiveEvent = id => {
    handleDeleteEvent(id);
  };

  React.useEffect(() => {
    let tempEventsList = applyStatusFilter(statusFilter);
    if (nameFilter.trim().length > 0) {
      tempEventsList = tempEventsList.filter(
        event => event.name.search(nameFilter) !== -1
      );
      setEvents(tempEventsList)
    }else{
      
      setEvents(tempEventsList);
    }
  }, [nameFilter]);

  const handleChangeNameFilter = e => {
    setNameFilter(e.target.value.trim());
  };

  const applyStatusFilter = status => {
    let tempEvents = [...mockEvents];
    switch (status) {
      case "all":
        //tempEvents = [...mockEvents];
        break;
      case "active":
        //TODO: change to event.status where possible
        tempEvents = tempEvents.filter(event =>
          moment(moment()).isBetween(
            event.activationDate.split("T")[0] +
              " " +
              event.activationDate.split("T")[1],
            event.endDate.split("T")[0] + " " + event.endDate.split("T")[1],
            null,
            "[]"
          )
        );
        break;
      case "awaiting":
        //TODO: change to event.status where possible
        tempEvents = tempEvents.filter(
          event =>
            !moment(moment()).isBetween(
              event.activationDate.split("T")[0] +
                " " +
                event.activationDate.split("T")[1],
              event.endDate.split("T")[0] + " " + event.endDate.split("T")[1],
              null,
              "[]"
            )
        );
        break;
      case "ended":
        tempEvents = tempEvents.filter(event => event.status === "ended");
        break;
      case "archived":
        tempEvents = tempEvents.filter(event => event.status === "archived");
        break;
      default:
        break;
    }

    setEvents(tempEvents);
    return tempEvents
  };

  const handleChangeStatusFilter = e => {
    const status = e.target.value;
    setStatusFilter(status);
    applyStatusFilter(status);
  };

  return (
    <div>
      {showNewEventCreator ? (
        <NewEventCreator
          open={showNewEventCreator}
          handleClose={handleCloseEventCreator}
          isEdit={showNewEventCreator === "edit"}
          eventToEdit={
            showNewEventCreator === "edit"
              ? events.find(event => event.id === currentEvent)
              : null
          }
        />
      ) : (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewEventCreator}
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
              <FormControl style={{ alignSelf: "flex-start" }}>
                <InputLabel htmlFor="status-filter">Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleChangeStatusFilter}
                  inputProps={{
                    id: "status-filter"
                  }}
                >
                  <MenuItem value={"all"}>Wszystkie</MenuItem>
                  <MenuItem value={"active"}>Aktywne</MenuItem>
                  <MenuItem value={"awaiting"}>Oczekujące</MenuItem>
                  <MenuItem value={"ended"}>Zakończone</MenuItem>
                  <MenuItem value={"archived"}>Zarchiwizowane</MenuItem>
                </Select>
              </FormControl>
              <TextField
                value={nameFilter}
                onChange={handleChangeNameFilter}
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

          {events.length > 0 && (
            <List
              style={{
                width: "70%",
                border: "1px solid grey",
                margin: "0 auto"
              }}
            >
              {events.map((event, index) => {
                return (
                  <EventListItem
                    key={event.id}
                    isLast={events.length - 1 === index}
                    event={event}
                    activateNow={handleShowActivateNowDialog}
                    editEvent={handleEditEventCreator}
                    deleteEvent={handleDeleteEvent}
                    archiveEvent={handleArchiveEvent}
                    active={moment(moment()).isBetween(
                      event.activationDate.split("T")[0] +
                        " " +
                        event.activationDate.split("T")[1],
                      event.endDate.split("T")[0] +
                        " " +
                        event.endDate.split("T")[1],
                      null,
                      "[]"
                    )}
                  />
                );
              })}
            </List>
          )}
        </div>
      )}
      {currentEvent && (
        <Dialog
          open={showActivateNowDialog}
          onClose={handleHideActivateNowDialog}
        >
          <DialogTitle>
            Opublikuj wydarzenie{" "}
            {events.find(event => event.id === currentEvent).name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Wydarzenie zostanie opublikowane{" "}
              {moment().format("YYYY-MM-DD, HH:mm")}.
            </DialogContentText>
            <FormControlLabel
              control={
                <Checkbox
                  checked={changeEndDate}
                  onChange={toggleChangeEndDate}
                />
              }
              label="Zmienić datę zakończenia?"
            />
            {changeEndDate && (
              <React.Fragment>
                <Typography>Czas zakończenia wydarzenia: </Typography>
                <TextField
                  type="datetime-local"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </React.Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHideActivateNowDialog} color="secondary">
              Anuluj
            </Button>
            <Button onClick={handleActivateNow} color="primary">
              Zatwierdź
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminMissions;
