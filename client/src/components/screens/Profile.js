import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";

import Attribute from "./profile/Attribute";
import Equipment from "./profile/Equipment";
import NewLevelDialog from "./profile/NewLevelDialog";
import PerkBox from "./profile/PerkBox";
import PartyCreationDialog from "./profile/PartyCreationDialog";
import PartyJoiningDialog from "./profile/PartyJoiningDialog";
import RankDialog from "./profile/RankDialog";
import StatsDialog from "./profile/StatsDialog";
import NewRallyAwardsDialog from "./profile/NewRallyAwardsDialog";
import NewShopAwardsDialog from "./profile/NewShopAwardsDialog";
import ProfileMissionInstanceWarningDialog from "./profile/ProfileMissionInstanceWarningDialog";

import { updateParty, removeMember } from "../../store/actions/partyActions";
import {
  createAvatarPlaceholder,
  designateUserLevel,
  bagArrayToCategories
} from "../../utils/methods";
import {
  appearancePath,
  usersPath,
  classThemes,
  uiPaths,
  palette
} from "../../utils/definitions";

import {
  toggleItem,
  deleteItem,
  clearRallyAwards,
  clearShopAwards,
  confirmLevel
} from "../../store/actions/profileActions";
import { authCheck } from "../../store/actions/authActions";
import { classLabels } from "../../utils/labels";
import maleBody from '../../assets/profile/male-body.png';
import femaleBody from '../../assets/profile/female-body.png';

const FabIcon = styled.img`
  width: 2rem;
`;

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    position: "relative"
  },
  avatarCard: {
    alignSelf: "stretch",
    marginBottom: "1rem",
    display: "grid",
    grid: "100% 100% "
  },
  avatarImage: {
    width: "100%",
    gridColumn: 1,
    gridRow: 1
  },
  expBar: {
    width: "100%",
    marginBottom: "1rem"
  },
  eqHeading: {
    margin: "1rem 0"
  }
}));




const Profile = props => {
  const history = useHistory();
  const classes = useStyles();

  const [bag, setBag] = React.useState(
    bagArrayToCategories(props.auth.profile.bag)
  );
  const [equippedItems, setEquippedItems] = React.useState(null);

  React.useEffect(() => {
    setBag(bagArrayToCategories(props.auth.profile.bag));
  }, [props.auth.profile.bag]);

  React.useEffect(() => {
    setEquippedItems(props.auth.profile.equipped);
    updateEquippedItems();
  }, [props.auth.profile.equipped]);

  const [activePerks, setActivePerks] = React.useState([]);

  const [goExp, setGoExp] = React.useState(false);
  const [userLevel, setUserLevel] = React.useState(1);
  const [relativeExp, setRelativeExp] = React.useState(0);
  const [relativeThreshold, setRelativeThreshold] = React.useState(0);
  const [isJoiningParty, setIsJoiningParty] = React.useState(false);
  const [isCreatingParty, setIsCreatingParty] = React.useState(false);
  const [showRankDialog, setShowRankDialog] = React.useState(false);
  const [showStatsDialog, setShowStatsDialog] = React.useState(false);
  const [
    missionInstanceWarningDialog,
    setMissionInstanceWarningDialog
  ] = React.useState({ action: null, text: "" });

  React.useEffect(() => {
    if (
      history.location.state &&
      history.location.state.hasOwnProperty("authCheck")
    ) {
      props.onAuthCheck();
    }
    updateEquippedItems();
    props.onPartyUpdate();
  }, []);

  React.useEffect(() => {
    const levelData = designateUserLevel(props.auth.profile.experience, true);
    setUserLevel(levelData.level);
    setRelativeExp(levelData.relativeExp);
    setRelativeThreshold(levelData.relativeThreshold);
  }, [props.auth.profile.experience]);

  React.useEffect(()=>{
    if(props.party.inShop && props.party.leader._id === props.auth.uid){
      history.push("/shop", { id: props.auth.uid });
    }
  }, [props.party.inShop])

  const updateEquippedItems = () => {
    const equipment = {
      head: null,
      chest: null,
      hands: null,
      legs: null,
      feet: null,
      weaponRight: null,
      weaponLeft: null,
      ringRight: null,
      ringLeft: null,
      scroll: null
    };
    const perks = [];

    Object.keys(props.auth.profile.equipped).forEach(category => {
      let loadedEquippedItem;
      if (category.startsWith("weapon")) {
        loadedEquippedItem =
          bag.weapon &&
          bag.weapon.find(
            item => item._id === props.auth.profile.equipped[category]
          );
      } else if (category.startsWith("ring")) {
        loadedEquippedItem =
          bag.ring &&
          bag.ring.find(
            item => item._id === props.auth.profile.equipped[category]
          );
      } else {
        loadedEquippedItem =
          bag[category] &&
          bag[category].find(
            item => item._id === props.auth.profile.equipped[category]
          );
      }

      if (loadedEquippedItem) {
        equipment[category] = loadedEquippedItem.itemModel.appearanceSrc;
        if (
          loadedEquippedItem.itemModel.hasOwnProperty("perks") &&
          loadedEquippedItem.itemModel.perks.length > 0
        ) {
          loadedEquippedItem.itemModel.perks.forEach(perk => {
            perks.push(perk);
          });
        }
      }
    });

    setEquippedItems({ ...equipment });
    setActivePerks([...perks]);
  };

  const handleItemToggle = (id, isEquipped, category, twoHanded) => {
    const tempPlayer = { ...props.auth.profile };
    if (props.party && props.party.inShop) {
      return;
    } else {
      if (category === "weapon") {
        if (twoHanded) {
          if (isEquipped) {
            tempPlayer.equipped.weaponRight = null;
            tempPlayer.equipped.weaponLeft = null;
          } else {
            tempPlayer.equipped.weaponRight = id;
            tempPlayer.equipped.weaponLeft = null;
          }
        } else {
          const rightHandItem =
            tempPlayer.equipped.weaponRight &&
            bag.weapon.find(
              item => item._id === tempPlayer.equipped.weaponRight
            ).itemModel;
          if (
            rightHandItem &&
            rightHandItem.hasOwnProperty("twoHanded") &&
            rightHandItem.twoHanded
          ) {
            tempPlayer.equipped.weaponRight = null;
          }

          if (
            !tempPlayer.equipped.weaponRight &&
            !tempPlayer.equipped.weaponLeft
          ) {
            tempPlayer.equipped.weaponRight = id;
          } else if (
            tempPlayer.equipped.weaponRight &&
            !tempPlayer.equipped.weaponLeft
          ) {
            if (tempPlayer.equipped.weaponRight === id) {
              tempPlayer.equipped.weaponRight = null;
            } else {
              tempPlayer.equipped.weaponLeft = id;
            }
          } else if (
            !tempPlayer.equipped.weaponRight &&
            tempPlayer.equipped.weaponLeft
          ) {
            if (tempPlayer.equipped.weaponLeft === id) {
              tempPlayer.equipped.weaponLeft = null;
            } else {
              tempPlayer.equipped.weaponRight = id;
            }
          } else if (
            tempPlayer.equipped.weaponRight &&
            tempPlayer.equipped.weaponLeft
          ) {
            if (tempPlayer.equipped.weaponRight === id) {
              tempPlayer.equipped.weaponRight = null;
            } else {
              tempPlayer.equipped.weaponLeft = null;
            }
          }
        }
      } else if (category === "ring") {
        if (!tempPlayer.equipped.ringRight && !tempPlayer.equipped.ringLeft) {
          tempPlayer.equipped.ringRight = id;
        } else if (
          tempPlayer.equipped.ringRight &&
          !tempPlayer.equipped.ringLeft
        ) {
          if (tempPlayer.equipped.ringRight === id) {
            tempPlayer.equipped.ringRight = null;
          } else {
            tempPlayer.equipped.ringLeft = id;
          }
        } else if (
          !tempPlayer.equipped.ringRight &&
          tempPlayer.equipped.ringLeft
        ) {
          if (tempPlayer.equipped.ringLeft === id) {
            tempPlayer.equipped.ringLeft = null;
          } else {
            tempPlayer.equipped.ringRight = id;
          }
        } else if (
          tempPlayer.equipped.ringRight &&
          tempPlayer.equipped.ringLeft
        ) {
          if (tempPlayer.equipped.ringRight === id) {
            tempPlayer.equipped.ringRight = null;
          } else {
            tempPlayer.equipped.ringLeft = null;
          }
        }
      } else {
        tempPlayer.equipped[category] = isEquipped ? null : id;
      }

      props.onItemToggle(id, category, tempPlayer.equipped);
    }
  };

  const handleItemDelete = id => {
    // const modifyItemArrayIndex = tempPlayer.bag[category].findIndex(
    //   item => {
    //     return item._id === id;
    //   }
    // );

    // tempPlayer.bag[category].splice(modifyItemArrayIndex, 1);
    // if (!tempPlayer.bag[category].length) {
    //   delete tempPlayer.bag[category];
    // }
    // setPlayer({ ...tempPlayer });
    if (props.party && props.party.inShop) {
      return;
    } else {
      props.onItemDelete(id);
      updateEquippedItems();
    }
  };

  // const handleAddExperience = newExp => {
  //   const tempPlayer = { ...player };
  //   if (tempPlayer.currentExp + newExp >= tempPlayer.nextLevelAtExp) {
  //     setPlayer({ ...handleNewLevel(tempPlayer) });
  //     setNewLevelDialogOpen(true);
  //   } else {
  //     tempPlayer.currentExp += newExp;
  //     setPlayer({ ...tempPlayer });
  //   }
  // };

  // const handleNewLevel = player => {
  //   player.level++;
  //   player.currentExp = player.nextLevelAtExp - player.currentExp;
  //   const tempCurrentExpBasis = player.nextLevelAtExp;
  //   player.nextLevelAtExp = player.currentExpBasis + player.nextLevelAtExp;
  //   player.currentExpBasis = tempCurrentExpBasis;

  //

  //   return player;
  // };

  //const handleNewLevelDialogClose = attribute => {
  //setNewLevelDialogOpen(false);
  // const attributes = { ...props.auth.profile.attributes };
  // attributes[attribute]++;
  //TODO: backend add attribute point
  //};

  // const handleGoExp = () => {
  //   console.log(props.location.push('shop'));
  //   setGoExp(prev => !prev);
  // };

  const handleOpenShop = () => {
    history.push("/shop", { id: props.auth.uid });
  };

  const handleLeaveParty = () => {
    props.onRemoveMember(props.party._id, props.auth.uid);
  };

  const handleMissionInstanceWarningDialog = (action, text) => {
    setMissionInstanceWarningDialog({ action, text });
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.wrapper}
      spacing={2}
    >
              {(props.party &&
            props.party.leader &&
            (props.party.leader._id === props.auth.uid ||
              props.party.leader === props.auth.uid)) ||
          (!props.party.leader && !props.party.members.length) ? (
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom: "1rem" }}
              onClick={
                props.mission.activeInstanceId
                  ? () =>
                      handleMissionInstanceWarningDialog(() => handleOpenShop(), "Otworzenie sklepu")
                  : handleOpenShop
              }
            >
              <img
              src={uiPaths.goExp}
                style={{
                  width: '2rem',
                  paddingRight: '1rem',
                }}
              />
              Idziemy expić!
              <img
              src={uiPaths.goExp}
                style={{
                  paddingRight: '1rem',
                  width: '2rem',
                  transform: "scaleX(-1.0)"
                }}
              />
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              style={{ marginBottom: "1rem" }}
            >
              Idziemy expić!
              <img
              src={uiPaths.goExp}
                style={{
                  width: '2rem',
                  transition: "transform 500ms ease-out",
                  transform: goExp ? "rotate(540deg)" : "rotate(0deg)"
                }}
              />
            </Button>
          )}
      <Typography variant="h5">
        {" "}
        Poziom {userLevel}{" "}
        <img src={uiPaths[props.auth.profile.class]} width={32} />{" "}
      </Typography>

      <Typography variant="subtitle2">
        Doświadczenie: {relativeExp + " / " + relativeThreshold}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(relativeExp * 100) / relativeThreshold}
        className={classes.expBar}
      />

      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Paper style={{ width: "100%" }} className={classes.avatarCard}>
          {/* body */}
          <img
            src={props.auth.profile.sex === 'female' ? femaleBody : maleBody}
            className={classes.avatarImage}
          />
          {/* legs */}
          {equippedItems && equippedItems.legs && (
            <img
              className={classes.avatarImage}
              src={`${appearancePath}${equippedItems.legs}`}
            />
          )}
          {/* feet */}
          {equippedItems && equippedItems.feet && (
            <img
              className={classes.avatarImage}
              src={`/${appearancePath}${equippedItems.feet}`}
            />
          )}
          {/* chest */}
          {equippedItems && equippedItems.chest && (
            <img
              className={classes.avatarImage}
              src={`${appearancePath}${equippedItems.chest}`}
            />
          )}
          {/* head */}
          {equippedItems &&
            equippedItems.head &&
            equippedItems.head.includes(".") && (
              <img
                className={classes.avatarImage}
                src={`${appearancePath}${equippedItems.head}`}
              />
            )}
          {/* Main-hand weapon */}

          {equippedItems && equippedItems.weaponRight && (
            <img
              className={classes.avatarImage}
              src={`${appearancePath}${equippedItems.weaponRight}`}
            />
          )}
          {/* Off-hand weapon */}
          {equippedItems && equippedItems.weaponLeft && (
            <img
              className={classes.avatarImage}
              src={`${appearancePath}${equippedItems.weaponLeft}`}
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          <Grid
            container
            item
            style={{ width: "100%" }}
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            <Grid container item style={{borderTop: palette.border, paddingTop: '0.4rem'}}>
              <Grid item xs={6}>
                <Attribute
                  attributeName="Siła"
                  attributeIcon={uiPaths.strength}
                  attributeValue={props.auth.profile.attributes.strength}
                  attributeModifier={props.auth.profile.userPerks.attrStrength}
                />
              </Grid>
              <Grid item xs={6}>
                <Attribute
                  attributeName="Zręczność"
                  attributeIcon={uiPaths.dexterity}
                  attributeValue={props.auth.profile.attributes.dexterity}
                  attributeModifier={props.auth.profile.userPerks.attrDexterity}
                />
              </Grid>
            </Grid>

            <Grid container item style={{ paddingTop: '0.4rem', paddingBottom: '0.6rem'}}>
              <Grid item xs={6}>
                <Attribute
                  attributeName="Magia"
                  attributeIcon={uiPaths.magic}
                  attributeValue={props.auth.profile.attributes.magic}
                  attributeModifier={props.auth.profile.userPerks.attrMagic}
                />
              </Grid>
              <Grid item xs={6}>
                <Attribute
                  attributeName="Wytrzymałość"
                  attributeIcon={uiPaths.endurance}
                  attributeValue={props.auth.profile.attributes.endurance}
                  attributeModifier={props.auth.profile.userPerks.attrEndurance}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>

      </Grid>
      {activePerks.length > 0 && (
        <React.Fragment>
          <Typography variant="h5" className={classes.eqHeading}>
            Aktualne efekty
          </Typography>
          <PerkBox perks={activePerks} />
        </React.Fragment>
      )}
      <Typography variant="h5" className={classes.eqHeading}>
        Ekwipunek
      </Typography>

      <Equipment
        items={bag}
        equipped={
          props.auth.profile.hasOwnProperty("equipped") &&
          props.auth.profile.equipped
        }
        handleItemToggle={handleItemToggle}
        handleItemDelete={handleItemDelete}
        leaderInShop={props.party && props.party._id && props.party.inShop}
        activeMission={props.mission.activeInstanceId}
      />
      <Typography variant="h5" className={classes.eqHeading}></Typography>
      {props.party && props.party.leader && props.party.leader._id && (
        <div>
          {props.party.leader._id === props.auth.uid ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsCreatingParty(prev => !prev)}
              disabled={props.auth.multipleSession}
            >
              Zarządzaj drużyną
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLeaveParty}
              disabled={props.auth.multipleSession}
            >
              Opuść drużynę
            </Button>
          )}
        </div>
      )}

      {props.party && props.party.leader && props.party.leader._id ? (
        <Paper style={{ width: "100%", marginTop: "2rem" }}>
          <List>
            <ListItem>
              <Badge
                badgeContent="Lider"
                color="primary"
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
              >
                <ListItemAvatar>
                  {props.party.leader.avatar ? (
                    <img
                      src={usersPath + props.party.leader.avatar}
                      width="32"
                    />
                  ) : (
                    <Avatar>
                      {createAvatarPlaceholder(props.party.leader.name)}
                    </Avatar>
                  )}
                </ListItemAvatar>
              </Badge>
              <ListItemText
                primary={props.party.leader.name}
                style={{
                  maxWidth: "40vw",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              />
            </ListItem>

            {props.party.members.length > 0 &&
              props.party.members.map(partyMember => {
                return (
                  <ListItem key={partyMember._id}>
                    <ListItemAvatar>
                      {partyMember.avatar ? (
                        <img src={usersPath + partyMember.avatar} width="32" />
                      ) : (
                        <Avatar>
                          {createAvatarPlaceholder(partyMember.name)}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={partyMember.name}
                      style={{
                        maxWidth: "40vw",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    />
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      ) : (
        <Grid container justify="space-around">
          <Grid item container direction="column" alignItems="center" xs={6}>
            <Fab
              color="primary"
              onClick={
                props.mission.activeInstanceId
                  ? () =>
                      handleMissionInstanceWarningDialog(
                        () => setIsJoiningParty(prev => !prev),
                        "Poszukiwanie drużyny"
                      )
                  : () => setIsJoiningParty(prev => !prev)
              }
            >
              {/* <EmojiPeopleIcon /> */}
              <FabIcon src={uiPaths.lookForGroup} style={{ width: "2rem" }} />
            </Fab>
            <Typography variant="caption" style={{ marginTop: "0.4rem" }}>
              Szukaj drużyny
            </Typography>
          </Grid>
          <Grid item container direction="column" alignItems="center" xs={6}>
            <Fab
              color="primary"
              onClick={
                props.mission.activeInstanceId
                  ? () =>
                      handleMissionInstanceWarningDialog(
                        () => setIsCreatingParty(prev => !prev),
                        "Tworzenie drużyny"
                      )
                  : () => setIsCreatingParty(prev => !prev)
              }
            >
              {/* <GroupAddIcon /> */}
              <FabIcon src={uiPaths.addMember} style={{ width: "2rem" }} />
            </Fab>
            <Typography variant="caption" style={{ marginTop: "0.4rem" }}>
              Utwórz drużynę
            </Typography>
          </Grid>
        </Grid>
      )}
      <Typography variant="h5" className={classes.eqHeading}></Typography>
      <Grid container justify="space-around">
        <Grid item container direction="column" alignItems="center" xs={6}>
          <Fab color="primary" onClick={() => setShowRankDialog(prev => !prev)}>
            {/* <EmojiEventsIcon /> */}
            <FabIcon src={uiPaths.ranking} style={{ width: "2rem" }} />
          </Fab>
          <Typography variant="caption" style={{ marginTop: "0.4rem" }}>
            Ranking
          </Typography>
        </Grid>
        <Grid item container direction="column" alignItems="center" xs={6}>
          <Fab
            color="primary"
            onClick={() => setShowStatsDialog(prev => !prev)}
          >
            {/* <EqualizerIcon /> */}
            <FabIcon src={uiPaths.statistics} style={{ width: "2rem" }} />
          </Fab>
          <Typography variant="caption" style={{ marginTop: "0.4rem" }}>
            Statystyki
          </Typography>
        </Grid>
      </Grid>

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
        partyName={props.party && props.party.name}
        handleClose={() => setIsCreatingParty(prev => !prev)}
        activeMission={props.mission.activeInstanceId}
      />
      {showRankDialog && (
        <RankDialog
          open={showRankDialog}
          profile={props.auth.profile}
          uid={props.auth.uid}
          handleClose={() => setShowRankDialog(prev => !prev)}
        />
      )}

      <StatsDialog
        open={showStatsDialog}
        profile={props.auth.profile}
        handleClose={() => setShowStatsDialog(prev => !prev)}
      />

      <NewLevelDialog
        open={
          props.auth.profile.levelNotifications > 0 &&
          !props.auth.profile.rallyNotifications.isNew &&
          !props.auth.profile.shopNotifications.isNew
        }
        confirmLevel={attribute => props.confirmLevel(attribute)}
        userLevel={userLevel}
        levelNotifications={props.auth.profile.levelNotifications}
        attributes={props.auth.profile.attributes}
      />

      <NewRallyAwardsDialog
        open={props.auth.profile.rallyNotifications.isNew && !props.auth.profile.shopNotifications.isNew}
        clearRallyAwards={() => props.clearRallyAwards()}
        profile={props.auth.profile}
      />

      <NewShopAwardsDialog
        open={props.auth.profile.shopNotifications.isNew}
        clearShopAwards={() => props.clearShopAwards()}
        profile={props.auth.profile}
      />

      <ProfileMissionInstanceWarningDialog
        open={Boolean(missionInstanceWarningDialog.action)}
        handleClose={() =>
          setMissionInstanceWarningDialog({ action: null, text: "" })
        }
        handleAction={missionInstanceWarningDialog.action}
        text={missionInstanceWarningDialog.text}
      />
    </Grid>
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
    onItemToggle: (id, category, equipped) =>
      dispatch(toggleItem(id, category, equipped)),
    onItemDelete: id => dispatch(deleteItem(id)),
    onPartyUpdate: (params, socketAuthReconnect) =>
      dispatch(updateParty(params, socketAuthReconnect)),
    onRemoveMember: (partyId, memberId) =>
      dispatch(removeMember(partyId, memberId)),
    clearRallyAwards: () => dispatch(clearRallyAwards()),
    clearShopAwards: () => dispatch(clearShopAwards()),
    confirmLevel: attribute => dispatch(confirmLevel(attribute)),
    onAuthCheck: () => dispatch(authCheck())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
