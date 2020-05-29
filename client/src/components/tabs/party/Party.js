import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import PartyCreationDialog from "./PartyCreationDialog";
import PartyJoiningDialog from "./PartyJoiningDialog";

import AvatarWithPlaceholder from "components/AvatarWithPlaceholder";
import { updateParty, removeMember } from "store/actions/partyActions";
import { authCheck } from "store/actions/authActions";
import {
  getUserLevel,
} from "utils/functions";
import {
  uiPaths,
  palette,
  warningActionSources
} from "utils/definitions";

import { classLabels } from "utils/labels";
import { PintoSerifTypography, PintoTypography } from "utils/fonts";
import { setCheckWarning } from "store/actions/communicationActions";
import { getMissionList } from "store/actions/missionActions";


const FabIcon = styled.img`
  width: 2rem;
`;


const Party = props => {
  const [isJoiningParty, setIsJoiningParty] = React.useState(false);
  const [isCreatingParty, setIsCreatingParty] = React.useState(false);

  const handleLeaveParty = () => {
    props.onRemoveMember(props.party._id, props.auth.uid);
  };

  const handlePartyUpdate = async () => {
    const isParty = await props.onPartyUpdate(null)
    if (isParty) await props.missionsUpdate()
  }

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

      {partyExists ? (
        <div
          style={{ width: "100%", marginTop: "2rem", marginBottom: "10rem" }}
        >
          <List>
            <ListItem style={{paddingRight:0, paddingLeft:0}}>
              <ListItemAvatar style={{ position: "relative" }}>
                <React.Fragment>
                  <img
                    alt="leader"
                    src={uiPaths.leader}
                    style={{ position: "absolute", top: "-30px", left: "1rem", width:'2rem' }}
                  />
                  <AvatarWithPlaceholder 
                      avatar={props.party.leader.avatar}
                      width="4rem"
                      height="4rem"
                      placeholder={{
                          text: props.party.leader.name,
                          fontSize: '2.4rem'
                      }}
                  />
                  
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
                    {getUserLevel(props.party.leader.experience, false)},{" "}
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
                      <AvatarWithPlaceholder 
                        avatar={partyMember.avatar}
                        width="4rem"
                        height="4rem"
                        placeholder={{
                            text: partyMember.name,
                            fontSize: '2.4rem'
                        }}
                      />
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
                        {getUserLevel(partyMember.experience, false)},{" "}
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
                props.setCheckWarning(
                  () => setIsJoiningParty(prev => !prev),
                  "Poszukiwanie drużyny",
                  warningActionSources.party
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
                props.setCheckWarning(
                  () => setIsCreatingParty(prev => !prev),
                  "Utworzenie drużyny",
                  warningActionSources.party
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
              Znajdź lub utwórz nową drużynę, by razem wypełniać misje!
            </PintoTypography>
          </Grid>
        </Grid>
      )}
      <PartyJoiningDialog
        open={isJoiningParty}
        userId={props.auth.uid}
        forcePartyUpdate={handlePartyUpdate}
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
    onPartyUpdate: (params) =>
      dispatch(updateParty(params)),
    onRemoveMember: (partyId, memberId) =>
      dispatch(removeMember(partyId, memberId)),
    onAuthCheck: () => dispatch(authCheck()),
    setCheckWarning: (action, text, actionType) => dispatch(setCheckWarning(action, text, actionType)),
    missionsUpdate: () => dispatch(getMissionList()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Party);
