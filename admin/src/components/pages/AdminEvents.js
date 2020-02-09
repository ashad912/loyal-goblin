import React, { Component } from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/pl";
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
import Grid from "@material-ui/core/Grid";
import { MuiPickersUtilsProvider, DateTimePicker} from "@material-ui/pickers";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from '@material-ui/core/IconButton';
import EventIcon from '@material-ui/icons/Event';

import EventCreator from "../events/EventCreator";
import EventMissionListItem from "../events/EventMissionListItem";
import EventRallyListItem from "../events/EventRallyListItem";

import {
  getEvents,
  updateEvent,
  createEvent,
  deleteEvent
} from "../../store/actions/eventActions";

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
    isInstant: false,
    raidIsInstantStart: false,
    activationDate: moment().format("YYYY-MM-DDTHH:mm"),
    changeStartDate: false,
    startDate: moment()
      .add(1, "d")
      .format("YYYY-MM-DDTHH:mm"),
    changeExpiryDate: false,
    isPermanent: false,
    expiryDate: moment()
      .add(2, "d")
      .format("YYYY-MM-DDTHH:mm"),
    dateErrors: {
      activationDate: ["", ""],
      startDate: ["", ""],
      expiryDate: ["", ""]
    },
    disableEventDateChange: false,
    awaitingRallyList: false,
    collisionRallyList: [],
    fetchInterval: null,
    copyMission: false,
    copiedEventName: '',
    showDeleteDialog: false
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
  

  handleValidateDates = (value, type) => {

    const isRally = this.state.currentEventIsRally;
    const event = {
      activationDate: moment(this.state.activationDate),
      startDate: isRally ? moment(this.state.changeStartDate ? this.state.startDate : this.state.currentEventDates.startDate) : null,
      expiryDate: moment(this.state.changeExpiryDate ? this.state.expiryDate : this.state.currentEventDates.expiryDate)
    };

    event[type] = moment(value);

    const errors = { ...this.state.dateErrors };



    switch (type) {
      case "activationDate":
        if ( event.activationDate.isSameOrAfter(event.expiryDate)) {
          errors.activationDate[0] =
            "Czas publikacji nie może być późniejszy niż czas zakończenia";
        } else {
          errors.activationDate[0] = "";
        }
        if (isRally && event.activationDate.isAfter(event.startDate)) {
          errors.activationDate[1] =
            "Czas publikacji nie może być późniejszy niż czas rozpoczęcia";
        } else {
          errors.activationDate[1] = "";
        }

        break;
      case "startDate":
        if ( isRally && event.startDate.isBefore(event.activationDate)) {
          errors.startDate[0] =
            "Czas rozpoczęcia nie może być wcześniejszy niż czas publikacji";
        } else {
          errors.startDate[0] = "";
        }
        if (isRally && event.startDate.isSameOrAfter(event.expiryDate)) {
          errors.startDate[1] =
            "Czas rozpoczęcia nie może być późniejszy niż czas zakończenia";
        } else {
          errors.startDate[1] = "";
        }
        break;

      case "expiryDate":
        if (event.expiryDate.isSameOrBefore(event.activationDate)) {
          errors.expiryDate[0] =
            "Czas zakończenia nie może być wcześniejszy niż czas publikacji";
        } else {
          errors.expiryDate[0] = "";
        }
        if (isRally && event.expiryDate.isSameOrBefore(event.startDate)) {
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
      errors[type]
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

  handleInstantChange = () => {
    this.setState(prevState => {
      return { isInstant: !prevState.isInstant };
    }, () => {
      this.handleActivationDateChange(moment())
    });
  };

  handlePermanentChange = () => {
    this.setState(prevState => {
      return { isPermanent: !prevState.isPermanent };
    }, () => {
      this.handleExpiryDateChange(moment().add(200, 'y'))
    });
  };

  handleExpiryDateChange = input => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    const result = this.handleValidateDates(date, "expiryDate");
   // console.log(result)
    this.setState(
      prevState => {
        return {
          expiryDate: result.value ? result.value : prevState.expiryDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        this.handleCheckDateErrors();
        if(this.state.currentEventIsRally){
          this.handleCheckRallyDates()
        }
      }
    );
  };

  handleStartDateChange = input => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    const result = this.handleValidateDates(date, "startDate");
    
    this.setState(
      prevState => {
        return {
          startDate: result.value ? result.value : prevState.startDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        this.handleCheckDateErrors();
        if(this.state.currentEventIsRally){
          this.handleCheckRallyDates()
        }
      }
    );
  };

  toggleRaidIsInstantStart = () => {
    this.setState(prevState => {
      return {raidIsInstantStart: !prevState.raidIsInstantStart}
    }, () => {
      if(this.state.raidIsInstantStart){

        this.handleStartDateChange(moment(this.state.activationDate))
      }


    })
  }

  handleActivationDateChange= input => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    const result = this.handleValidateDates(date, "activationDate");
    this.setState(
      prevState => {
        return {
          activationDate: result.value ? result.value : prevState.activationDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        this.handleCheckDateErrors();
        if(this.state.currentEventIsRally){
          this.handleCheckRallyDates()
        }
      }
    );
  };

  handleCheckRallyDates = () => {
    if (
      this.state.activationDate &&
      this.state.expiryDate &&
      this.state.startDate
    ) {
      this.setState({ awaitingRallyList: true },  () => {
        const rallyList = this.state.events.filter(event => !event.hasOwnProperty('level'))

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
        isInstant: false,
        raidIsInstantStart: false,
        activationDate: "",
        startDate: "",
        isPermanent: false,
        expiryDate: "",
        changeStartDate: false,
        changeExpiryDate: false,
        copyMission: false,
        dateErrors: {
          activationDate: ["", ""],
          startDate: ["", ""],
          expiryDate: ["", ""]
        },
        copiedEventName: '',
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
      }, () => {
        this.state.currentEventIsRally && this.handleCheckRallyDates()
      })
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

  handleActivateNow = async () => {
    const tempEvents = [...this.state.events];
    const eventIndex = tempEvents.findIndex(
      event => event._id === this.state.currentEvent
    );
    tempEvents[eventIndex].activationDate = this.state.activationDate;

    if (!tempEvents[eventIndex].hasOwnProperty('level') && this.state.changeStartDate && this.state.startDate) {
      tempEvents[eventIndex].startDate = moment(this.state.startDate).format(
        "YYYY-MM-DDTHH:mm"
      );
    }

    if (this.state.changeExpiryDate && this.state.expiryDate) {
      tempEvents[eventIndex].expiryDate = moment(this.state.expiryDate).format(
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
      this.handleCheckDateErrors()
      this.handleShowActivateNowDialog(id)
    })
  }

  
  handleCopyMission = async () => {
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
      ...tempEvents[eventIndex],
      activationDate: tempEvents[eventIndex].activationDate,
      expiryDate: tempEvents[eventIndex].expiryDate,
      title: this.state.copiedEventName
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

  handleCopiedEventName = e => {
    this.setState({copiedEventName: e.target.value})
  }


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
    // switch (this.state.statusFilter) {
    //   case "all":
    //     break;
    //   case "ready":
    //     tempEvents = tempEvents.filter(event => event.status === "ready");

    //     break;
    //   case "active":
    //     tempEvents = tempEvents.filter(event => event.status === "active");
    //     break;
    //   case "running":
    //     tempEvents = tempEvents.filter(event => event.status === "running");
    //     break;
    //   case "archive":
    //     tempEvents = tempEvents.filter(event => event.status === "archive");
    //     break;
    //   default:
    //     break;
    // }
    if (this.state.nameFilter.length > 0) {
      //console.log(tempEvents)
      tempEvents = tempEvents.filter(event => event.title.toLowerCase().search(this.state.nameFilter) !== -1);
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
                width: "80%",
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
                  width: "80%",
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
           <MuiPickersUtilsProvider utils={MomentUtils}>
          <Dialog
            open={this.state.showActivateNowDialog}
            onClose={this.handleHideActivateNowDialog}
          >
            <DialogTitle>
        {this.state.copyMission ? "Kopiuj wydarzenie " : "Opublikuj wydarzenie "}
                {currentEventTitle}
            </DialogTitle>
            <DialogContent>
              {this.state.copyMission && <TextField style={{ marginBottom: "1rem" }}
              value={this.state.copiedEventName}
                  onChange={this.handleCopiedEventName}
                  margin="dense"
                  label="Nowa nazwa misji"
                  type="text"/>}
              <DialogContentText component="div" color="textPrimary">
                {this.state.copyMission ? 
              <React.Fragment>
              {/* <Typography>Czas publikacji misji: </Typography> */}
              {/* <TextField
                type="datetime-local"
                value={this.state.activationDate}
                onChange={this.handleActivationDateChange}
                style={{ marginBottom: 
                  "1rem" }}
              /> */}
              {!this.state.isInstant && 
              
               <DateTimePicker
                    cancelLabel={'Anuluj'}
                    ampm={false}
                    label={"Czas publikacji misji:"}
                    value={this.state.activationDate}
                    onChange={this.handleActivationDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
              }
            <FormControlLabel
            style={{marginLeft: '1.5rem'}}
                control={
                  <Checkbox
                    checked={this.state.isInstant}
                    onChange={this.handleInstantChange}
                  />
                }
                label="Publikuj natychmiast"
              />
            </React.Fragment>
            :
            <span>
              Wydarzenie zostanie opublikowane{" "}
              {moment().format("YYYY-MM-DD, HH:mm")}.
            </span>  
              }
              </DialogContentText>
              {this.state.currentEventIsRally && this.state.collisionRallyList.length > 0 && (
                <div >
                  <Typography style={{ color: "rgb(206, 0, 0)" }}>
                    Rajdy kolidujące czasowo:
                  </Typography>
                  {this.state.collisionRallyList.map(rally => {
                    return (
                      <p
                        style={{ color: "rgb(157, 0, 0)" }}
                        key={rally.title}
                      >{`${rally.title}: od ${moment(rally.activationDate).format(
                        "lll"
                      )} do ${moment(rally.expiryDate).format("lll")}`}</p>
                    );
                  })}
                </div>
              )}
              
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
              {!this.state.copyMission && 
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.changeExpiryDate}
                    onChange={this.toggleChangeExpiryDate}
                  />
                }
                label="Zmienić datę zakończenia?"
              />
              }
              {this.state.currentEventIsRally && this.state.changeStartDate && (
                <React.Fragment>
                  <Grid direction="column" container>
                {this.state.dateErrors.startDate.map((dateError, index) => {
                  return (
                    <Grid item key={index}>
                      <Typography
                        variant="caption"
                        style={{ color: "rgb(206, 0, 0)" }}
                      >
                        {dateError}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
                  {/* <Typography>Czas rozpoczęcia rajdu: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.startDate}
                    onChange={this.handleStartDateChange}
                    style={{ marginBottom: "1rem" }}
                  /> */}
                {!this.state.raidIsInstantStart && 
                  <DateTimePicker
                    cancelLabel={'Anuluj'}
                    ampm={false}
                    label={"Czas rozpoczęcia rajdu:"}
                    value={this.state.startDate}
                    onChange={this.handleStartDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                }
                {this.state.changeStartDate && 
                
                 <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.raidIsInstantStart}
                    onChange={this.toggleRaidIsInstantStart}
                  />
                }
                label="Rozpocznij natychmiast"
              />
                }

                </React.Fragment>
              )}
              {(this.state.changeExpiryDate || this.state.copyMission) && (
                <React.Fragment>
                  <Grid direction="column" container>
                {this.state.dateErrors.expiryDate.map((dateError, index) => {
                  return (
                    <Grid item key={index}>
                      <Typography
                        variant="caption"
                        style={{ color: "rgb(206, 0, 0)" }}
                      >
                        {dateError}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
                  {/* <Typography>Czas zakończenia {this.state.currentEventIsRally ? 'rajdu' : 'misji'}: </Typography>
                  <TextField
                    type="datetime-local"
                    value={this.state.expiryDate}
                    onChange={this.handleExpiryDateChange}
                  /> */}
                  {!this.state.isPermanent &&
                  <DateTimePicker
                    cancelLabel={'Anuluj'}
                    ampm={false}
                    label={`Czas zakończenia ${this.state.currentEventIsRally ? 'rajdu' : 'misji'}:`}
                    value={this.state.expiryDate}
                    onChange={this.handleExpiryDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon/>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  }
                  {!this.state.currentEventIsRally && 
                  
                <FormControlLabel
                style={{marginLeft: '1.5rem'}}
                control={
                  <Checkbox
                    checked={this.state.isPermanent}
                    onChange={this.handlePermanentChange}
                  />
                  }
                  label="Wydarzenie bezterminowe"
                  />
                }
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
              variant="contained"
                onClick={this.state.copyMission ? this.handleCopyMission : this.handleActivateNow}
                color="primary"
                disabled={this.state.disableEventDateChange || (this.state.copyMission && this.state.copiedEventName.trim().length <= 0)}
              >
                Zatwierdź
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
        open={this.state.showDeleteDialog}
        onClose={this.handleHideDeleteDialog}
      >
        <DialogTitle >        Usuń wydarzenie{" "}
                {currentEventTitle}</DialogTitle>

        <DialogActions>
          <Button onClick={this.handleHideDeleteDialog} color="secondary">
            Anuluj
          </Button>
          <Button onClick={this.handleDeleteEvent} color="primary" variant="contained" autoFocus>
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
      </MuiPickersUtilsProvider>

        )}
      </div>
    );
  }
}

export default AdminEvents;
