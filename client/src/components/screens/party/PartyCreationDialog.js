import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import Menu from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import {
  createParty,
  deleteParty,
  addMember,
  removeMember,
  giveLeader
} from "../../../store/actions/partyActions";
import {
  setActiveInstance
} from "../../../store/actions/missionActions";
import QRreaderView from "./QRreaderView";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import { uiPaths, palette, usersPath, warningActionSources } from "../../../utils/definitions";
import { PintoTypography, PintoSerifTypography } from "../../../utils/fonts";
import { ListItemAvatar, Avatar } from "@material-ui/core";
import { createAvatarPlaceholder } from "../../../utils/methods";
import {setCheckWarning} from 'store/actions/communicationActions'



const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const PartyCreationDialog = props => {
  const [partyName, setPartyName] = React.useState(props.party ? props.party.name : '');
  const [isManagingParty, setIsManagingParty] = React.useState(
    props.isManagingParty
  );
  const [showScanner, setShowScanner] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activePartyMember, setActivePartyMember] = React.useState("");

  React.useEffect(() => {
    setIsManagingParty(props.isManagingParty);
  }, [props.isManagingParty]);
  // React.useEffect(() => {
  //   setPartyName(props.partyName);
  // }, [props.partyName]);

  const handlePartyNameChange = e => {
    if (e.target.value.length < 30) {
      setPartyName(e.target.value);
    }
  };

  const handleQRscanStart = () => {
    setShowScanner(prev => !prev);
  };

  const handleMoreClick = (event, memberId) => {
    event.stopPropagation();
    if(memberId){
      setActivePartyMember(memberId)
    }
    setAnchorEl(event.currentTarget);
  };
  
  const handleMoreClose = event => {
    event.stopPropagation();
    setActivePartyMember("")
    setAnchorEl(null);
  };
  
  const handleAddMember = id => {
    setShowScanner(false);
    props.onAddMember(props.party._id, id);
  };
  
  const handleRemoveFromParty = () => {
    props.onRemoveMember(props.party._id, activePartyMember);
    setActivePartyMember("")
    setAnchorEl(null);
  };

  const handleGiveLeader = () => {
    props.onGiveLeader(props.party._id, activePartyMember);
    setActivePartyMember("")
    setAnchorEl(null);
    props.handleClose();

  };

  const handlePartyDisband = () => {
    props.onPartyDelete();
    props.handleClose();
  };

  const handlePartyCreateConfirm = () => {
    props.onPartyCreate(partyName.trim(), {
      _id: props.auth.uid,
      name: props.auth.profile.name,
      avatar: props.auth.profile.avatar,
      experience: props.auth.profile.experience,
      class: props.auth.profile.class,
    });
    setIsManagingParty(true);
  };

  // const handleWarningDialogAction = (action, text, type) => {

  //   //saving function reference in useState is possible only by wrapping in anonymous function
  //   //https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1

  //   //component class state it can be achieved in classic way
  //   // this.setState({
  //   //   warningAction: action
  //   // })

  //   setWarningAction(() => action)
  //   setWarningText(text)
  //   setWarningType(type)
  //   setWarningOpen(true)
  // }


  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{ style: { height: '100%' } }}
      fullScreen
      style={{ zIndex: 2000 }}
    >
      {isManagingParty && (
        <DialogTitle style={{textAlign:'center'}}>Zarządzaj drużyną {props.party.name}</DialogTitle>
      )}
      <DialogContent>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {!isManagingParty && (
            <Grid item style={{ width: "100%" }}>
              <PintoSerifTypography variant="h5" style={{textAlign:'center', marginBottom:'2rem', marginTop:'20vh'}}>Utwórz nową drużynę</PintoSerifTypography>
              <TextField
                inputProps={{style: {textAlign:'center'}}}
                fullWidth
                placeholder="Nazwa drużyny"
                value={partyName}
                onChange={handlePartyNameChange}
              />
            </Grid>
          )}
          <Grid item style={{ width: "100%" }}>
            <List>
              {props.party.members.map(partyMember => {
                return (
                  <ListItem key={partyMember._id} >
                    <ListItemAvatar>
                    {partyMember.avatar ? (
                        <img src={usersPath + partyMember.avatar} width="32" />
                      ) : (
                        <Avatar>
                          {createAvatarPlaceholder(partyMember.name)}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText primary={<PintoTypography style={{fontSize:'1.4rem'}}>{partyMember.name}</PintoTypography>} />
                
                    <ListItemIcon onClick={e=>handleMoreClick(e, partyMember._id)}>
                      <Button>
                        <MoreHorizIcon style={{fontSIze:'2rem',color:palette.background.darkGrey}} />
                      </Button>
                    </ListItemIcon>
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
                disabled={partyName.trim().length <= 0}
              >
                Dalej
              </Button>
            </Grid>
          )}
          {props.party.members && props.party.members.length <= 7 && isManagingParty && (
            <React.Fragment>
              <Grid item>
                <Button
                  variant="contained"

                  onClick={()=> props.setCheckWarning(handleQRscanStart, "Zmiana liczebności drużyny", warningActionSources.party)}
                >
                  {props.party.members && props.party.members.length > 0 ? "Dodaj kolejną osobę" : 'Dodaj osobę'}
                </Button>
              </Grid>
              <Grid item>
                <PintoTypography style={{fontSize:'1.2rem', color: palette.background.darkGrey, textAlign:'center'}}>By dodać osobę, zeskanuj kod QR wyświetlony na jej telefonie.</PintoTypography>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMoreClose}
        style={{zIndex: 3000}}
      >
        <StyledMenuItem onClick={() => props.setCheckWarning(handleRemoveFromParty, 'Usunięcie członka drużyny', warningActionSources.party)} >
          <ListItemIcon>

            <img src={uiPaths.deleteRed} style={{width: '2rem'}}/>
          </ListItemIcon>
          <ListItemText primary={<PintoTypography>Wyrzuć z drużyny</PintoTypography>} />
        </StyledMenuItem>
        <StyledMenuItem onClick={()=> props.setCheckWarning(handleGiveLeader, "Przekazanie tytułu lidera", warningActionSources.party)} >
          <ListItemIcon >

            <img src={uiPaths.transferLeader} style={{width: '2rem'}}/>
          </ListItemIcon>
          <ListItemText primary={<PintoTypography>Przekaż stanowisko lidera</PintoTypography>} />
        </StyledMenuItem>
      </StyledMenu>

      </DialogContent>
      
      <DialogActions>
        {props.isManagingParty && (
          <Button
            color="secondary"
            variant="contained"
            onClick={() => props.setCheckWarning(handlePartyDisband, "Czy chcesz rozwiązać drużynę? Rozwiązanie drużyny", warningActionSources.party)}
          >
            Rozwiąż drużynę
          </Button>
        )}
        <Button variant="contained" onClick={props.handleClose}>
          Zamknij
        </Button>
      </DialogActions>
      {showScanner && (
        <QRreaderView
          handleAddMember={handleAddMember}
          handleReturn={handleQRscanStart}
        />
      )}
    </Dialog>
  );
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPartyCreate: (name, leader) => dispatch(createParty(name, leader)),
    onPartyDelete: () => dispatch(deleteParty()),
    onAddMember: (partyId, memberId) => dispatch(addMember(partyId, memberId)),
    onRemoveMember: (partyId, memberId) =>
      dispatch(removeMember(partyId, memberId)),
    onGiveLeader: (partyId, memberId) => dispatch(giveLeader(partyId, memberId)),
    setActiveInstance: (id, imgSrc) => dispatch(setActiveInstance(id, imgSrc)),
    setCheckWarning: (action, text, actionType) => dispatch(setCheckWarning(action, text, actionType))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartyCreationDialog);
