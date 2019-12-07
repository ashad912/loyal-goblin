import React from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { createParty, deleteParty, addMember, removeMember } from "../../../store/actions/partyActions";
import QRreaderView from "./QRreaderView";

const PartyCreationDialog = props => {
  const [partyName, setPartyName] = React.useState(props.partyName);
  const [party, setParty] = React.useState([]);
  const [isManagingParty, setIsManagingParty] = React.useState(
    props.isManagingParty
  );
  const [showScanner, setShowScanner] = React.useState(false)
  React.useEffect(() => {
    setIsManagingParty(props.isManagingParty);
  }, [props.isManagingParty]);
  React.useEffect(() => {
    setPartyName(props.partyName);
  }, [props.partyName]);

  const handlePartyNameChange = e => {
    if (e.target.value.length < 30) {
      setPartyName(e.target.value.trim());
    }
  };

  const handleQRscanStart = () => {

    setShowScanner(prev =>!prev )
   
  };

  const handleAddMember = id => {
    setShowScanner(false)
    props.onAddMember(props.party._id, id)
  }

  // const handlePartySave = () => {
  //   //replace with backend call
  //   if (party.length > 0) {
  //     const finalParty = {
  //       name: partyName,
  //       leader: {
  //         _id: props.auth.uid,
  //         name: props.auth.profile.name,
  //         avatar: props.auth.profile.avatar || "moose.png"
  //       },
  //       members: [...party]
  //     };
  //     localStorage.setItem("party", JSON.stringify(finalParty));
  //     props.handleCreateParty();
  //     props.handleClose();
  //   }
  // };

  const handleRemoveFromParty = id => {
    props.onRemoveMember(props.party._id, id)
  };

  const handlePartyDisband = () => {
    // setParty([]);
    // setPartyName("");
    // localStorage.removeItem("party");
    // props.handleCreateParty();
    props.onPartyDelete();
    props.handleClose();
  };

  const handlePartyCreateConfirm = () => {
    props.onPartyCreate(partyName, {
      _id: props.auth.uid,
      name: props.auth.profile.name,
      avatar: props.auth.profile.avatar
    });
    setIsManagingParty(true);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{ style: { minHeight: "50vh" } }}
      fullScreen
      style={{ zIndex: 2000 }}
    >
      {!isManagingParty ? (
        <DialogTitle>Stwórz nową drużynę</DialogTitle>
      ) : (
        <DialogTitle>Zarządzaj drużyną {partyName}</DialogTitle>
      )}
      <DialogContent>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {!isManagingParty && (
            <Grid item style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Nazwa drużyny"
                value={partyName}
                onChange={handlePartyNameChange}
              />
            </Grid>
          )}
          <Grid item style={{ width: "100%" }}>
            <List>
              {props.party.members.map(partyMember => {
                return (
                  <ListItem key={partyMember._id}>
                    <ListItemText primary={partyMember.name} />
                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        onClick={e => handleRemoveFromParty(partyMember._id)}
                      >
                        Wyrzuć
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          {!isManagingParty && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePartyCreateConfirm}
              >
                Dalej
              </Button>
            </Grid>
          )}
          {party.length <= 8 && isManagingParty && (


            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleQRscanStart}
              >
                Dodaj osobę
              </Button>
            </Grid>


          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        {props.isManagingParty && (
          <Button
            color="secondary"
            variant="contained"
            onClick={handlePartyDisband}
          >
            Rozwiąż drużynę
          </Button>
        ) }
        <Button variant="contained" onClick={props.handleClose} >
          Zamknij
        </Button>
      </DialogActions>
      {showScanner &&
      <QRreaderView handleAddMember={handleAddMember}/>
      }
    </Dialog>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    party: state.party
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPartyCreate: (name, leader) => dispatch(createParty(name, leader)),
    onPartyDelete: () => dispatch(deleteParty()),
    onAddMember: (partyId, memberId) => dispatch(addMember(partyId, memberId)),
    onRemoveMember: (partyId, memberId) => dispatch(removeMember(partyId, memberId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartyCreationDialog);
