import React, { Component } from "react";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/pl";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event'


moment.locale("pl");

class EventManagementDialog extends Component {
  state = {
    copiedEventName: "",
    isInstant: false,
    activationDate: moment().format("YYYY-MM-DDTHH:mm"),
    changeStartDate: false,
    changeExpiryDate: false,
    dateErrors: {
      activationDate: ["", ""],
      startDate: ["", ""],
      expiryDate: ["", ""]
    },
    raidIsInstantStart: false,
    startDate: moment()
      .add(1, "d")
      .format("YYYY-MM-DDTHH:mm"),
    isPermanent: false,
    expiryDate: moment()
      .add(2, "d")
      .format("YYYY-MM-DDTHH:mm"),
    disableEventDateChange: false,
    awaitingRallyList: false,
    collisionRallyList: []
  };

  componentDidMount() {
    if (this.props.currentEventIsRally) {
      this.handleCheckRallyDates();
    }
    if (this.props.copyMission) {
      this.handleCheckDateErrors();
    }
  }

  handleCopiedEventName = e => {
    this.setState({ copiedEventName: e.target.value });
  };

  handleInstantChange = () => {
    this.setState(
      prevState => {
        return { isInstant: !prevState.isInstant };
      },
      () => {
        this.handleActivationDateChange(moment());
      }
    );
  };

  handleActivationDateChange = input => {
    const date = input.format("YYYY-MM-DDTHH:mm");
    const result = this.handleValidateDates(date, "activationDate");
    this.setState(
      prevState => {
        return {
          activationDate: result.value
            ? result.value
            : prevState.activationDate,
          dateErrors: { ...result.errors }
        };
      },
      () => {
        this.handleCheckDateErrors();
        if (this.state.currentEventIsRally) {
          this.handleCheckRallyDates();
        }
      }
    );
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

  handleStartDateChange = input => {
    const date = input.format("YYYY-MM-DDTHH:mm");
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
        if (this.state.currentEventIsRally) {
          this.handleCheckRallyDates();
        }
      }
    );
  };

  toggleRaidIsInstantStart = () => {
    this.setState(
      prevState => {
        return { raidIsInstantStart: !prevState.raidIsInstantStart };
      },
      () => {
        if (this.state.raidIsInstantStart) {
          this.handleStartDateChange(moment(this.state.activationDate));
        }
      }
    );
  };

  handleExpiryDateChange = input => {
    const date = input.format("YYYY-MM-DDTHH:mm");
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
        if (this.state.currentEventIsRally) {
          this.handleCheckRallyDates();
        }
      }
    );
  };

  handlePermanentChange = () => {
    this.setState(
      prevState => {
        return { isPermanent: !prevState.isPermanent };
      },
      () => {
          if(this.state.isPermanent){
              this.handleExpiryDateChange(moment().add(200, "y"));
          }else{
            this.handleExpiryDateChange(moment(this.state.activationDate).add(2, "d"));
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
      this.setState({ awaitingRallyList: true }, () => {
        const rallyList = [...this.props.rallyList]

        const rally = {
          activationDate: moment(this.state.activationDate),
          expiryDate: moment(this.state.expiryDate)
        };

        const newRallyActivation = rally.activationDate.valueOf();
        const newRallyEnd = rally.expiryDate.valueOf();

        let causingRallyList = [];
        rallyList.forEach(rallyItem => {
          if (rallyItem._id === this.props.currentEvent) {
            return;
          }
          const existingRallyActiviation = moment(
            rallyItem.activationDate
          ).valueOf();
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

  handleValidateDates = (value, type) => {
    const isRally = this.state.currentEventIsRally;
    const event = {
      activationDate: moment(this.state.activationDate),
      startDate: isRally
        ? moment(
            this.state.changeStartDate
              ? this.state.startDate
              : this.props.currentEventDates.startDate
          )
        : null,
      expiryDate: moment(
        this.state.changeExpiryDate
          ? this.state.expiryDate
          : this.props.currentEventDates.expiryDate
      )
    };

    event[type] = moment(value);

    const errors = { ...this.state.dateErrors };

    switch (type) {
      case "activationDate":
        if (event.activationDate.isSameOrAfter(event.expiryDate)) {
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
        if (isRally && event.startDate.isBefore(event.activationDate)) {
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

    if (errors[type].every(error => error === "")) {
      return { value, errors };
    } else {
      return { value: null, errors };
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

  handleCopyMission = () => {
      this.props.handleCopyMission({
          activationDate: this.state.activationDate,
          changeExpiryDate: this.state.changeExpiryDate,
          expiryDate: this.state.expiryDate,
          copiedEventName: this.state.copiedEventName
      })
  };

  handleActivateNow = () => {
    this.props.handleActivateNow({
      activationDate: this.state.activationDate,
      changeStartDate: this.state.changeStartDate,
      startDate: this.state.startDate,
      changeExpiryDate: this.state.changeExpiryDate,
      expiryDate: this.state.expiryDate
    });
  };

  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Dialog open={this.props.open} onClose={this.props.onClose}>
          <DialogTitle>
            {this.props.copyMission
              ? "Kopiuj wydarzenie "
              : "Opublikuj wydarzenie "}
            {this.props.currentEventTitle}
          </DialogTitle>
          <DialogContent>
            {this.props.copyMission && (
              <TextField
                style={{ marginBottom: "1rem" }}
                value={this.state.copiedEventName}
                onChange={this.handleCopiedEventName}
                margin="dense"
                label="Nowa nazwa misji"
                type="text"
                fullWidth
              />
            )}
            <DialogContentText component="div" color="textPrimary">
              {this.props.copyMission ? (
                <React.Fragment>
                  {!this.state.isInstant && (
                    <DateTimePicker
                      cancelLabel={"Anuluj"}
                      ampm={false}
                      label={"Czas publikacji misji:"}
                      value={this.state.activationDate}
                      onChange={this.handleActivationDateChange}
                      format="YYYY-MM-DD HH:mm"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <EventIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  <FormControlLabel
                    style={{ marginLeft: "1.5rem" }}
                    control={
                      <Checkbox
                        checked={this.state.isInstant}
                        onChange={this.handleInstantChange}
                      />
                    }
                    label="Publikuj natychmiast"
                  />
                </React.Fragment>
              ) : (
                <span>
                  Wydarzenie zostanie opublikowane{" "}
                  {moment().format("YYYY-MM-DD, HH:mm")}.
                </span>
              )}
            </DialogContentText>
            {this.props.currentEventIsRally &&
              this.state.collisionRallyList.length > 0 && (
                <div>
                  <Typography style={{ color: "rgb(206, 0, 0)" }}>
                    Rajdy kolidujące czasowo:
                  </Typography>
                  {this.state.collisionRallyList.map(rally => {
                    return (
                      <p
                        style={{ color: "rgb(157, 0, 0)" }}
                        key={rally.title}
                      >{`${rally.title}: od ${moment(
                        rally.activationDate
                      ).format("lll")} do ${moment(rally.expiryDate).format(
                        "lll"
                      )}`}</p>
                    );
                  })}
                </div>
              )}

            {this.props.currentEventIsRally && (
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
            {!this.props.copyMission && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.changeExpiryDate}
                    onChange={this.toggleChangeExpiryDate}
                  />
                }
                label="Zmienić datę zakończenia?"
              />
            )}
            {this.props.currentEventIsRally && this.state.changeStartDate && (
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
                {!this.state.raidIsInstantStart && (
                  <DateTimePicker
                    cancelLabel={"Anuluj"}
                    ampm={false}
                    label={"Czas rozpoczęcia rajdu:"}
                    value={this.state.startDate}
                    onChange={this.handleStartDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                {this.state.changeStartDate && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.raidIsInstantStart}
                        onChange={this.toggleRaidIsInstantStart}
                      />
                    }
                    label="Rozpocznij natychmiast"
                  />
                )}
              </React.Fragment>
            )}
            {(this.state.changeExpiryDate || this.props.copyMission) && (
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
                {!this.state.isPermanent && (
                  <DateTimePicker
                    cancelLabel={"Anuluj"}
                    ampm={false}
                    label={`Czas zakończenia ${
                      this.props.currentEventIsRally ? "rajdu" : "misji"
                    }:`}
                    value={this.state.expiryDate}
                    onChange={this.handleExpiryDateChange}
                    format="YYYY-MM-DD HH:mm"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton>
                            <EventIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                {!this.props.currentEventIsRally && (
                  <FormControlLabel
                    style={{ marginLeft: "1.5rem" }}
                    control={
                      <Checkbox
                        checked={this.state.isPermanent}
                        onChange={this.handlePermanentChange}
                      />
                    }
                    label="Wydarzenie bezterminowe"
                  />
                )}
              </React.Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose} color="secondary">
              Anuluj
            </Button>
            <Button
              variant="contained"
              onClick={
                this.props.copyMission ? this.handleCopyMission : this.handleActivateNow
              }
              color="primary"
              disabled={
                this.state.disableEventDateChange ||
                (this.props.copyMission &&
                  this.state.copiedEventName.trim().length <= 0)
              }
            >
              Zatwierdź
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.props.showDeleteDialog}
          onClose={this.props.handleHideDeleteDialog}
        >
          <DialogTitle>
            {" "}
            Usuń wydarzenie {this.props.currentEventTitle}
          </DialogTitle>

          <DialogActions>
            <Button
              onClick={this.props.handleHideDeleteDialog}
              color="secondary"
            >
              Anuluj
            </Button>
            <Button
              onClick={this.props.handleDeleteEvent}
              color="primary"
              variant="contained"
              autoFocus
            >
              Zatwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </MuiPickersUtilsProvider>
    );
  }
}

export default EventManagementDialog;
