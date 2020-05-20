import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import PartyCreationDialog from "./PartyCreationDialog";
import PartyJoiningDialog from "./PartyJoiningDialog";

import { updateParty, removeMember } from "store/actions/partyActions";
import { authCheck } from "store/actions/authActions";
import {
  createAvatarPlaceholder,
  designateUserLevel,
} from "utils/methods";
import {
  usersPath,
  uiPaths,
  palette
} from "utils/definitions";

import { classLabels } from "utils/labels";
import { PintoSerifTypography, PintoTypography } from "utils/fonts";

const FabIcon = styled.img`
  width: 2rem;
`;


const Party = props => {
  const [isJoiningParty, setIsJoiningParty] = React.useState(false);
  const [isCreatingParty, setIsCreatingParty] = React.useState(false);

  const handleLeaveParty = () => {
    props.onRemoveMember(props.party._id, props.auth.uid);
  };

  const partyExists =
    props.party && props.party.leader && props.party.leader._id;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: partyExists ? "flex-start" : "center",
        minHeight: props.fullHeight,
        background: `url(${uiPaths.people}) bottom center no-repeat`
      }}
    >
      {partyExists && (
        <Grid
          container
          justify="space-between"
          alignItems="center"
          style={{ marginTop: "2rem" }}
        >
          <Grid item>
            <PintoSerifTypography style={{ fontSize: "1.5rem" }}>
              {props.party.name}
            </PintoSerifTypography>
          </Grid>
          <Grid item>
            {props.party.leader._id === props.auth.uid ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCreatingParty(prev => !prev)}
                disabled={props.auth.multipleSession}
              >
                Zarządzaj
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLeaveParty}
                disabled={props.auth.multipleSession}
              >
                Opuść
              </Button>
            )}
          </Grid>
        </Grid>
      )}

      {props.party && props.party.leader && props.party.leader._id ? (
        <div
          style={{ width: "100%", marginTop: "2rem", marginBottom: "10rem" }}
        >
          <List>
            <ListItem style={{paddingRight:0, paddingLeft:0}}>
              <ListItemAvatar style={{ position: "relative" }}>
                <React.Fragment>
                  <img
                    src={uiPaths.leader}
                    style={{ position: "absolute", top: "-30px", left: "1rem", width:'2rem' }}
                  />
                  {props.party.leader.avatar ? (
                    <Avatar src={usersPath + props.party.leader.avatar} style={{width:'4rem', height:'4rem'}}/>
                  ) : (
                    <Avatar style={{width:'4rem', height:'4rem', fontSize:'1.4rem'}}>
                      {createAvatarPlaceholder(props.party.leader.name)}
                    </Avatar>
                  )}
                </React.Fragment>
              </ListItemAvatar>
              <Grid container direction="column" style={{ textAlign: "right" }}>
                <Grid item>
                  <PintoTypography style={{ fontSize: "2rem" }}>
                    {props.party.leader.name}
                  </PintoTypography>
                </Grid>
                <Grid item>
                  <PintoSerifTypography>
                    Poz.{" "}
                    {designateUserLevel(props.party.leader.experience, false)},{" "}
                    {classLabels[props.party.leader.class]}
                  </PintoSerifTypography>
                </Grid>
              </Grid>
            </ListItem>

            {props.party.members.length > 0 &&
              props.party.members.map(partyMember => {
                return (
                  <ListItem key={partyMember._id} style={{paddingRight:0, paddingLeft:0}}>
                    <ListItemAvatar>
                      {partyMember.avatar ? (
                        <Avatar src={usersPath + partyMember.avatar} style={{width:'4rem', height:'4rem'}}/>
                        
                      ) : (
                        <Avatar style={{width:'4rem', height:'4rem', fontSize:'1.4rem'}}>
                          {createAvatarPlaceholder(partyMember.name)}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <Grid container direction="column" style={{ textAlign: "right" }}>
                <Grid item>
                  <PintoTypography style={{ fontSize: "2rem" }}>
                    {partyMember.name}
                  </PintoTypography>
                </Grid>
                <Grid item>
                  <PintoSerifTypography>
                    Poz.{" "}
                    {designateUserLevel(partyMember.experience, false)},{" "}
                    {classLabels[partyMember.class]}
                  </PintoSerifTypography>
                </Grid>
              </Grid>
                  </ListItem>
                );
              })}
          </List>
        </div>
      ) : (
        <Grid
          container
          justify="space-around"
          direction="column"
          spacing={4}
          style={{ marginTop: "-15vh" }}
        >
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            onClick={
              () =>
                props.handleWarning(
                  () => setIsJoiningParty(prev => !prev),
                  "Poszukiwanie drużyny"
                )  
            }
          >
            <Fab color="primary">
              <FabIcon src={uiPaths.lookForGroup} style={{ width: "2rem" }} />
            </Fab>
            <PintoSerifTypography variant="h5" style={{ marginLeft: "2rem" }}>
              Szukaj drużyny
            </PintoSerifTypography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            onClick={
               () =>
                props.handleWarning(
                  () => setIsCreatingParty(prev => !prev),
                  "Tworzenie drużyny"
                )
            }
          >
            <Fab color="primary">
              <FabIcon src={uiPaths.addMember} style={{ width: "2rem" }} />
            </Fab>
            <PintoSerifTypography variant="h5" style={{ marginLeft: "2rem" }}>
              Utwórz drużynę
            </PintoSerifTypography>
          </Grid>
          <Grid>
            <PintoTypography
              style={{
                fontSize: "1.2rem",
                textAlign: "center",
                marginTop: "2rem",
                padding: "0 2rem",
                color: palette.background.darkGrey
              }}
            >
              Znajdź lub stwórz nową drużynę, by razem wypełniać misje!
            </PintoTypography>
          </Grid>
        </Grid>
      )}
      <PartyJoiningDialog
        open={isJoiningParty}
        userId={props.auth.uid}
        forcePartyUpdate={() => props.onPartyUpdate(null, true)}
        handleClose={() => setIsJoiningParty(prev => !prev)}
      />

      <PartyCreationDialog
        open={isCreatingParty}
        isManagingParty={
          props.party &&
          props.party.leader &&
          props.party.leader._id &&
          props.party.leader._id === props.auth.uid
        }
        auth={props.auth}
        party={props.party}
        handleClose={() => setIsCreatingParty(prev => !prev)}
        handleWarning={props.handleWarning}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    party: state.party,
    mission: state.mission
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPartyUpdate: (params, socketAuthReconnect) =>
      dispatch(updateParty(params, socketAuthReconnect)),
    onRemoveMember: (partyId, memberId) =>
      dispatch(removeMember(partyId, memberId)),
    onAuthCheck: () => dispatch(authCheck())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Party);
