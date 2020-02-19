import React, { Component } from "react";
import moment from "moment";
import "moment/locale/pl";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import EventCreator from "../events/EventCreator";
import EventMissionListItem from "../events/EventMissionListItem";
import EventRallyListItem from "../events/EventRallyListItem";

import {
  getEvents,
  updateEvent,
  createEvent,
  deleteEvent
} from "../../store/actions/eventActions";
import EventManagementDialog from "../events/EventManagementDialog";

moment.locale("pl");


class AdminEvents extends Component {
  state = {
    showNewEventCreator: "",
    fullEventList: [],
    events: [],
    typeFilter: "all",
    statusFilter: "all",
    nameFilter: "",
    currentEvent: null,
    currentEventDates: {
      activationDate: '',
      startDate: '',
      expiryDate: ''
    },
    currentEventIsRally: false,
    showActivateNowDialog: false,
    showDeleteDialog: false,
    collisionRallyList: [],
    fetchInterval: null,
    copyMission: false,



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
   const fetchInterval = setInterval(() => {
      this.fetchEvents()
    }, 300000 );
    this.setState({fetchInterval})
  }

  componentWillUnmount() {
    clearInterval(this.state.fetchInterval)
  }
  












  handleSetCurrentEvent = (id, cb) => {
    if (id) {

      const theEvent = this.state.events.find(event => event._id === id)
      if(theEvent){
        const isRally = !theEvent.hasOwnProperty("level");
        const currentEventDates = {activationDate: theEvent.activationDate, expiryDate: theEvent.expiryDate, startDate: isRally?theEvent.startDate : ''}

        this.setState(
          { currentEvent: id, currentEventIsRally: isRally, currentEventDates },
          () => cb
        );
      }
    } else {
      this.setState(
        { currentEvent: null, currentEventIsRally: null, currentEventDates:{
          activationDate: '',
          startDate: '',
          expiryDate: ''
        } },
        () => cb
      );
    }
  };

  handleHideActivateNowDialog = () => {
    this.handleSetCurrentEvent(
      null,
      this.setState({
        showActivateNowDialog: false,
        copyMission: false
      })
    );
  };

  handleShowActivateNowDialog = id => {
    this.handleSetCurrentEvent(
      id,
      this.setState({showActivateNowDialog: true})
    );
  };

  handleEditEventCreator = id => {
    this.handleSetCurrentEvent(
      id,
      this.setState({ showNewEventCreator: "edit", typeFilter: "all",
      statusFilter: "all",
      nameFilter: ""})
      );

  };

  handleNewEventCreator = e => {
    this.setState({ showNewEventCreator: "new", typeFilter: "all",
    statusFilter: "all",
    nameFilter: "",
    currentEvent: null });
  };

  handleCloseEventCreator = e => {
    this.fetchEvents();
    this.setState({ showNewEventCreator: "" });
  };

  handleActivateNow = async (payload) => {
    const tempEvents = [...this.state.events];
    const eventIndex = tempEvents.findIndex(
      event => event._id === this.state.currentEvent
    );
    tempEvents[eventIndex].activationDate = payload.activationDate;

    if (!tempEvents[eventIndex].hasOwnProperty('level') && payload.changeStartDate && payload.startDate) {
      tempEvents[eventIndex].startDate = moment(payload.startDate).format(
        "YYYY-MM-DDTHH:mm"
      );
    }

    if (payload.changeExpiryDate && payload.expiryDate) {
      tempEvents[eventIndex].expiryDate = moment(payload.expiryDate).format(
        "YYYY-MM-DDTHH:mm"
      );
    }
    const event = {
      _id: this.state.currentEvent,
      activationDate: tempEvents[eventIndex].activationDate,
      startDate: tempEvents[eventIndex].startDate,
      expiryDate: tempEvents[eventIndex].expiryDate
    };
   
    const eventId = await updateEvent(
      tempEvents[eventIndex].hasOwnProperty('level') ? "mission" : "rally",
      event
    );
      if(eventId){

        this.handleHideActivateNowDialog();
        this.fetchEvents();
      }
  };


  handleShowDeleteDialog = (id) => {
    this.handleSetCurrentEvent(
      id, this.setState({showDeleteDialog: true})
    )
  }

  handleHideDeleteDialog = () => {
    this.handleSetCurrentEvent(
      null, this.setState({showDeleteDialog: false})
    )
  }

  handleDeleteEvent = async () => {
    const tempEvents = [...this.state.events];
    const event = tempEvents.find(e => e._id === this.state.currentEvent)
    if(event){
      await deleteEvent(this.state.currentEventIsRally ? 'rally' : 'mission', event._id) 
      this.fetchEvents()
    }
    this.handleHideDeleteDialog()
  };

  handleCopyEventDialog = id => {
    this.setState({copyMission: true}, () => {
      this.handleShowActivateNowDialog(id)
    })
  }

  
  handleCopyMission = async (payload) => {
    const tempEvents = [...this.state.events];
    const eventIndex = tempEvents.findIndex(
      event => event._id === this.state.currentEvent
    );
    tempEvents[eventIndex].activationDate = payload.activationDate;

    if (payload.changeExpiryDate && payload.expiryDate) {
      tempEvents[eventIndex].expiryDate = moment(payload.expiryDate).format(
        "YYYY-MM-DDTHH:mm"
      );
    }
    const event = {
      ...tempEvents[eventIndex],
      activationDate: tempEvents[eventIndex].activationDate,
      expiryDate: tempEvents[eventIndex].expiryDate,
      title: payload.copiedEventName
    };
    delete event._id
   
    const eventId = await createEvent(
      "mission",
      event
    );
if(eventId){
  this.handleHideActivateNowDialog();
  this.fetchEvents();

}
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
          event.hasOwnProperty("level")
        );
        break;
        case "unique":
          tempEvents = tempEvents.filter(event =>
            event.unique
          );
          break;
      case "rally":
        tempEvents = tempEvents.filter(
          event => !event.hasOwnProperty("level")
        );

        break;

      default:
        break;
    }

    if (this.state.nameFilter.length > 0) {
      //console.log(tempEvents)
      tempEvents = tempEvents.filter( (event) => {
        const reg = new RegExp(this.state.nameFilter, 'gi')
        return event.hasOwnProperty('title') && event.title.match(reg)
      });
      //tempEvents = tempEvents.filter(event => event.title.toLowerCase().search(this.state.nameFilter) !== -1);
    }
    this.setState({ events: [...tempEvents] });
  };

  render() {

    const currentEventTitle = this.state.currentEvent && this.state.events.length > 0 && this.state.events.find(event => event._id === this.state.currentEvent) && this.state.events.find(event => event._id === this.state.currentEvent).title

    return (
      <div>
        {this.state.showNewEventCreator ? (
          <EventCreator
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
                width: "90%",
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
                    <MenuItem value={"unique"}>Misje unikalne</MenuItem>
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
                  width: "90%",
                  border: "1px solid grey",
                  margin: "0 auto"
                }}
              >
                {this.state.events.reverse().map((event, index) => {
                  return event.hasOwnProperty("level") && event.level ? (
                    <EventMissionListItem
                      key={event._id}
                      isLast={this.state.events.length - 1 === index}
                      event={event}
                      activationDate={event.activationDate}
                      expiryDate={event.expiryDate}
                      activateNow={this.handleShowActivateNowDialog}
                      editEvent={this.handleEditEventCreator}
                      deleteEvent={this.handleShowDeleteDialog}
                      archiveEvent={this.handleArchiveEvent}
                      statusFilter={this.state.statusFilter}
                      copyEvent={this.handleCopyEventDialog}
                    />
                  ) : (
                    <EventRallyListItem
                      key={event._id}
                      isLast={this.state.events.length - 1 === index}
                      event={event}
                      activationDate={event.activationDate}
                      startDate={event.startDate}
                      expiryDate={event.expiryDate}
                      activateNow={this.handleShowActivateNowDialog}
                      editEvent={this.handleEditEventCreator}
                      deleteEvent={this.handleShowDeleteDialog}
                      archiveEvent={this.handleArchiveEvent}
                     statusFilter={this.state.statusFilter}
                    />
                  );
                })}
              </List>
            )}
          </div>
        )}
        {this.state.currentEvent && (
          <EventManagementDialog 
            open = {this.state.showActivateNowDialog}
            onClose={this.handleHideActivateNowDialog}
            currentEvent={this.state.currentEvent}
            currentEventDates={this.state.currentEventDates}
            copyMission={this.state.copyMission}
            handleCopyMission={this.handleCopyMission}
            handleActivateNow={this.handleActivateNow}
            currentEventIsRally={this.state.currentEventIsRally}
            currentEventTitle={currentEventTitle}
            dateErrors={this.state.dateErrors}
            showDeleteDialog={this.state.showDeleteDialog}
            handleHideDeleteDialog={this.handleHideDeleteDialog}
            handleDeleteEvent={this.handleDeleteEvent}
            rallyList = {this.state.events.filter(event => !event.hasOwnProperty("level"))}
          />

        )}
      </div>
    );
  }
}

export default AdminEvents;
