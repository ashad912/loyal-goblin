import React from "react";
import { connect } from 'react-redux';
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

const PartyCreationDialog = props => {
    const [partyName, setPartyName] = React.useState('')
  const [party, setParty] = React.useState([]);


  const handlePartyNameChange = e => {
    if(e.target.value.length < 30  ){
        setPartyName(e.target.value.trim())
    }
  }

  const handleQRscanStart = () => {
    //implement QR reader
    alert("Wyobraź sobie, że teraz skanujemy kod QR");
    //change to real values
    setParty(prev => [
      ...prev,
      {
        _id: Math.random().toString(),
        name: Math.random()
          .toString(36)
          .substring(7),
          avatar: 'moose.png'
      }
    ]);
  };

  const handlePartySave = () => {
      //replace with backend call
      if(party.length > 0){
          const finalParty = {name: partyName, leader: {_id: props.auth.uid, name: props.auth.profile.name, avatar: props.auth.profile.avatar || 'moose.png'}, members: [...party]}
          localStorage.setItem("party", JSON.stringify(finalParty))
          props.handleCreateParty()
          props.handleClose()
      }
  }

  const handleRemoveFromParty = (id) => {
      if(party.length > 0){
          setParty(party.filter(member => member._id !== id))
      }
  }

  const handlePartyDisband = () => {
      setParty([])
      setPartyName('')
      localStorage.removeItem("party")
      props.handleCreateParty()
      props.handleClose()
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{ style: { minHeight: "50vh" } }}
      fullWidth
      style={{zIndex: 2000}}
    >
      {!props.isManagingParty ? (
        <DialogTitle>Stwórz nową drużynę</DialogTitle>
      ) : (
        <DialogTitle>Zarządzaj drużyną</DialogTitle>
      )}
      <DialogContent>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item style={{width: '100%'}}>
            <TextField fullWidth label="Nazwa drużyny" value={partyName} onChange={handlePartyNameChange} />
          </Grid>
          <Grid item style={{width: '100%'}}>
            <List>
              {party.map(partyMember => {
                return (
                  <ListItem key={partyMember._id}>
                    <ListItemText primary={partyMember.name} />
                    <ListItemSecondaryAction>
                        <Button color="secondary" onClick={(e)=>handleRemoveFromParty(partyMember._id)}>Wyrzuć</Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          {party.length <= 8 && 
        
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleQRscanStart}
            >
              Dodaj osobę
            </Button>
          </Grid>
        }
        </Grid>
      </DialogContent>
      <DialogActions>
      <Button color="secondary" onClick={props.handleClose}>
          Anuluj
        </Button>
        {props.isManagingParty && 
              <Button color="secondary" variant="contained" onClick={handlePartyDisband}>
              Rozwiąż drużynę
            </Button>}
        <Button color="primary" variant="contained"  onClick={handlePartySave} disabled={party.length <= 0}>
          {props.isManagingParty ? 'Zatwierdź zmiany' : 'Stwórz drużynę'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};




const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    }
}



export default connect(mapStateToProps)(PartyCreationDialog);
