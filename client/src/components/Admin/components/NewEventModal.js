import React, { Component } from "react";
import moment from "moment";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormLabel from "@material-ui/core/FormLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import diamondAmulet from "../../../assets/icons/items/diamond-amulet.png";
import sapphireAmulet from "../../../assets/icons/items/sapphire-amulet.png";
import pearlAmulet from "../../../assets/icons/items/pearl-amulet.png";
import emeraldAmulet from "../../../assets/icons/items/emerald-amulet.png";

import "moment/locale/pl";
moment.locale("pl");

const AmuletIcon = styled.img`
  width: 32px;
`;

class NewEventModal extends Component {
  state = {
    isRaid: false,
    icon: null,
    partySize: [1, 5],
    activationDate: new Date(Date.now()),
    isUnique: false,
  };

  handleUniqueChange = () => {
    this.setState(prevState => {
        return { isUnique: !prevState.isUnique };
      });
  }

  handleActivationDateChange = date => {
    this.setState({ activationDate: date });
  };

  handlePartySizeSliderChange = (event, newValue) => {
    this.setState({ partySize: newValue });
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
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Nowe wydarzenie</DialogTitle>
          <DialogContent>
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
              </Grid>
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label={`Nazwa ${this.state.isRaid ? "rajdu" : "misji"}`}
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              label={`Opis ${this.state.isRaid ? "rajdu" : "misji"}`}
              type="text"
              fullWidth
              multiline
              rows={2}
              rowsMax={5}
            />
            <TextField
              margin="dense"
              label={`Ikonka ${this.state.isRaid ? "rajdu" : "misji"}`}
              type="file"
              fullWidth
            />
            <Grid container>
              <Grid item>
                <FormLabel htmlFor="sapphireAmulets">
                  <AmuletIcon src={sapphireAmulet} />
                </FormLabel>
              </Grid>
              <Grid item>
                <Input type="number" name="sapphireAmulets" />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <FormLabel htmlFor="emeraldAmulets">
                  <AmuletIcon src={emeraldAmulet} />
                </FormLabel>
              </Grid>
              <Grid item>
                <Input type="number" name="emeraldAmulets" />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <FormLabel htmlFor="diamondAmulets">
                  <AmuletIcon src={diamondAmulet} />
                </FormLabel>
              </Grid>
              <Grid item>
                <Input type="number" name="diamondAmulets" />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <FormLabel htmlFor="pearlAmulets">
                  <AmuletIcon src={pearlAmulet} />
                </FormLabel>
              </Grid>
              <Grid item>
                <Input type="number" name="pearlAmulets" />
              </Grid>
            </Grid>
            <Typography>Wielkość drużyny:</Typography>
            <Slider
              value={this.state.partySize}
              onChange={this.handlePartySizeSliderChange}
              valueLabelDisplay="auto"
              max={20}
              min={1}
            />
            <TextField
              margin="dense"
              label="Minimalny poziom"
              type="number"
              fullWidth
            />

            <Typography>Wybierz datę aktywacji wydarzenia:</Typography>
            <DatePicker
              autoOk
              orientation="landscape"
              variant="static"
              openTo="date"
              label="Data aktywacji"
              value={this.state.activationDate}
              onChange={this.handleActivationDateChange}
            />
            <Typography>Określ czas trwania wydarzenia:</Typography>
            <Grid container>
              <Grid item>
                <TextField margin="dense" label="Dni" type="number" />
              </Grid>
              <Grid item>
                <TextField margin="dense" label="Godziny" type="number" />
              </Grid>
              <Grid item>
                <TextField margin="dense" label="Minuty" type="number" />
              </Grid>
              <Grid item>
                <TextField margin="dense" label="Sekundy" type="number" />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isUnique}
                  onChange={this.handleUniqueChange}
                />
              }
              label="Wydarzenie unikalne"
            />
             <Typography>Nagrody:</Typography>
             <TextField
              margin="dense"
              label="Punkty doświadczenia"
              type="number"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="secondary">
              Anuluj
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Stwórz
            </Button>
          </DialogActions>
        </Dialog>
      </MuiPickersUtilsProvider>
    );
  }
}

export default NewEventModal;
