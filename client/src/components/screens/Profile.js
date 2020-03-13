import React from "react";

import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";

import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


import Attribute from "./profile/Attribute";
import Equipment from "./profile/Equipment";
import NewLevelDialog from "./profile/NewLevelDialog";
import PerkBox from "./profile/PerkBox";


import NewRallyAwardsDialog from "./profile/NewRallyAwardsDialog";
import NewShopAwardsDialog from "./profile/NewShopAwardsDialog";

import { updateParty, removeMember } from "../../store/actions/partyActions";
import {
  designateUserLevel,
  bagArrayToCategories
} from "../../utils/methods";
import {
  appearancePath,
  uiPaths,
} from "../../utils/definitions";

import {
  toggleItem,
  deleteItem,
  clearRallyAwards,
  clearShopAwards,
  confirmLevel
} from "../../store/actions/profileActions";
import { authCheck } from "../../store/actions/authActions";
import maleBody from "../../assets/profile/male-body.png";
import femaleBody from "../../assets/profile/female-body.png";


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
    margin: "1rem 0",
    alignSelf:'flex-start'
  }
}));

const Profile = props => {
  const history = useHistory();
  const classes = useStyles();

  const [equipmentOpen, setEquipmentOpen] = React.useState(false)
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

  React.useEffect(() => {
    if (props.party.inShop && props.party.leader._id === props.auth.uid) {
      history.push("/shop", { id: props.auth.uid });
    }
  }, [props.party.inShop]);

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

  const handleToggleEquipment = isOpen => {
    setEquipmentOpen(isOpen)
  }

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.wrapper}
      spacing={2}
    >
      <Typography
        variant="h5"
        style={{ width: "100%", textAlign: "center", position: "relative" }}
      >
        Poziom {userLevel}
        <img
          src={uiPaths[props.auth.profile.class]}
          width={42}
          style={{ position: "absolute", right: 0 }}
        />
      </Typography>
      <Typography variant="subtitle2">
        PD: {relativeExp + " / " + relativeThreshold}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(relativeExp * 100) / relativeThreshold}
        className={classes.expBar}
      />

      <Grid
        item
        container
        direction="row"
        justify="center"
        alignItems="stretch"
        style={{ padding: "0.4rem 0" }}
      >
        <Grid item xs={8} style={{ padding: 0 }}>
          <div style={{ width: "100%", height: '100%' }} className={classes.avatarCard}>
            {/* body */}
            <img
              src={props.auth.profile.sex === "female" ? femaleBody : maleBody}
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
                src={`${appearancePath}${equippedItems.feet}`}
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

            {/* hands */}
            {equippedItems && equippedItems.hands && (
              <img
                className={classes.avatarImage}
                src={`${appearancePath}${equippedItems.hands}`}
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
          </div>
        </Grid>

        <Grid
          container
          item
          xs={4}
          style={{ width: "100%", padding: "0 0 0 1rem" }}
          direction="column"
          justify="space-between"
          alignItems="center"
        >
          <Grid item style={{ width: "100%" }}>
            <Attribute
              attributeName="Siła"
              attributeIcon={uiPaths.strength}
              attributeValue={props.auth.profile.attributes.strength}
              attributeModifier={props.auth.profile.userPerks.attrStrength}
            />
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <Attribute
              attributeName="Zręczność"
              attributeIcon={uiPaths.dexterity}
              attributeValue={props.auth.profile.attributes.dexterity}
              attributeModifier={props.auth.profile.userPerks.attrDexterity}
            />
          </Grid>

          <Grid item style={{ width: "100%" }}>
            <Attribute
              attributeName="Magia"
              attributeIcon={uiPaths.magic}
              attributeValue={props.auth.profile.attributes.magic}
              attributeModifier={props.auth.profile.userPerks.attrMagic}
            />
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <Attribute
              attributeName="Wytrzymałość"
              attributeIcon={uiPaths.endurance}
              attributeValue={props.auth.profile.attributes.endurance}
              attributeModifier={props.auth.profile.userPerks.attrEndurance}
            />
          </Grid>
          <Grid item style={{ width: "100%" }}>
              <div style={{marginTop:'1rem', width:'100%'}}>

          {(props.party &&
            props.party.leader &&
            (props.party.leader._id === props.auth.uid ||
              props.party.leader === props.auth.uid)) ||
          (!props.party.leader && !props.party.members.length) ? (
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom: "1rem" , padding: '0.6rem 1rem', width:'100%'}}
              onClick={
                props.mission.activeInstanceId
                  ? () =>
                      handleMissionInstanceWarningDialog(
                        () => handleOpenShop(),
                        "Otworzenie sklepu"
                      )
                  : handleOpenShop
              }
            >
              Przygoda
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              style={{ marginBottom: "1rem", padding: '0.6rem 1rem', width:'100%' }}
            >
              Przygoda
            </Button>
          )}
          <Button variant="contained" style={{background:'white', padding: '0.6rem 1rem', width:'100%'}} onClick={()=>setEquipmentOpen(prev => !prev)}>
            Ekwipunek
          </Button>
              </div>
          </Grid>
        </Grid>
      </Grid>
      {activePerks.length > 0 && (
        <React.Fragment>
          <Typography variant="h5" className={classes.eqHeading} >
            Aktywne efekty
          </Typography>
          <PerkBox perks={activePerks} />
        </React.Fragment>
      )}
      

      <Equipment
      toggle={handleToggleEquipment}
      isOpen={equipmentOpen}
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
        open={
          props.auth.profile.rallyNotifications.isNew &&
          !props.auth.profile.shopNotifications.isNew
        }
        clearRallyAwards={() => props.clearRallyAwards()}
        profile={props.auth.profile}
      />

      <NewShopAwardsDialog
        open={props.auth.profile.shopNotifications.isNew}
        clearShopAwards={() => props.clearShopAwards()}
        profile={props.auth.profile}
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
