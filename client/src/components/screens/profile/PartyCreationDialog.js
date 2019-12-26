import React from "react";
import styled from 'styled-components'
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
import { createParty, deleteParty, addMember, removeMember, giveLeader } from "../../../store/actions/partyActions";
import QRreaderView from "./QRreaderView";
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

const StyledSwipeableListItem = styled.div`
    background: rgba(0, 0, 0, 0.137);
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 4px 8px;
    user-select: none;
    cursor: pointer;
    margin-bottom: 0.2rem;
`
const TransferLeaderButton = styled.div`
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
        padding: 4px 8px;
background: rgb(55, 112, 194);
color: white;
`

const RemoveMemberButton = styled.div`
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
        padding: 4px 8px;
background: rgb(173, 49, 49);
color: white;
`

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

  const handleGiveLeader = id => {
    props.onGiveLeader(props.party._id, id)
    props.handleClose();
  }

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
          <SwipeableList threshold={0.75}>
              {props.party.members.map(partyMember => {
                return (
                  <SwipeableListItem key={partyMember._id}

    swipeLeft={{
      content: <RemoveMemberButton>Wyrzuć osobę z drużyny</RemoveMemberButton>,
      action: () => handleRemoveFromParty(partyMember._id)
    }}
    swipeRight={{
      content: <TransferLeaderButton>Przekaż stanowisko lidera drużyny</TransferLeaderButton>,
      action: () => handleGiveLeader(partyMember._id)
    }}
  >
    <StyledSwipeableListItem >
      <div style={{flexBasis: '20%', textAlign:'center'}}>
<ArrowBackIosIcon/>
              <TransferWithinAStationIcon style={{color: 'rgb(55, 112, 194)'}}/>
      </div>
              <p style={{flexBasis: '60%', maxWidth: '40vw', whiteSpace:'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bolder', textAlign: 'center'}}>{partyMember.name}</p>
              <div style={{flexBasis: '20%', textAlign:'center'}}>
              <HighlightOffIcon style={{color: 'rgb(173, 49, 49)'}}/>
                <ArrowForwardIosIcon/>

              </div>

                   

    </StyledSwipeableListItem>


    
  </SwipeableListItem>
                );
              })}
            </SwipeableList>
          </Grid>
          {!isManagingParty && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePartyCreateConfirm}
                disabled={partyName.trim().length <= 0}
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
      <QRreaderView handleAddMember={handleAddMember} handleReturn={handleQRscanStart}/>
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
    onRemoveMember: (partyId, memberId) => dispatch(removeMember(partyId, memberId)),
    onGiveLeader: (partyId, memberId) => dispatch(giveLeader(partyId, memberId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartyCreationDialog);
