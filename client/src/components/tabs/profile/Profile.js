import React from "react";

import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";

import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Attribute from "./Attribute";
import Equipment from "./Equipment";
import NewLevelDrawer from "./NewLevelDrawer";
import PerkBox from "./PerkBox";

import AwardsDialog from "./AwardsDialog";
import AvatarCard from "./AvatarCard";

import { updateParty, removeMember } from "store/actions/partyActions";
import { getUserLevel, bagArrayToCategories } from "utils/functions";
import { uiPaths, warningActionSources } from "utils/constants";

import {
  toggleItem,
  deleteItem,
  clearRallyAwards,
  clearShopAwards,
  confirmLevel,
} from "store/actions/profileActions";
import { authCheck } from "store/actions/authActions";
import { setCheckWarning } from "store/actions/communicationActions";


const useStyles = makeStyles((theme) => ({
  wrapper: {
    flexGrow: 1,
    position: "relative",
  },
  expBar: {
    width: "100%",
    marginBottom: "1rem",
  },
  eqHeading: {
    margin: "1rem 0",
    alignSelf: "flex-start",
  },
}));

const Profile = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const [equipmentOpen, setEquipmentOpen] = React.useState(false);
  const [bag, setBag] = React.useState(
    bagArrayToCategories(props.auth.profile.bag)
  );
  const [activePerks, setActivePerks] = React.useState([]);
  const [userLevel, setUserLevel] = React.useState(1);
  const [relativeExp, setRelativeExp] = React.useState(0);
  const [relativeThreshold, setRelativeThreshold] = React.useState(0);


  React.useEffect(() => {

    setBag(bagArrayToCategories(props.auth.profile.bag));
  }, [props.auth.profile.bag]);



  React.useEffect(() => {
    const levelData = getUserLevel(props.auth.profile.experience, true);
    setUserLevel(levelData.level);
    setRelativeExp(levelData.relativeExp);
    setRelativeThreshold(levelData.relativeThreshold);
  }, [props.auth.profile.experience]);


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
              (item) => item._id === tempPlayer.equipped.weaponRight
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

  const handleItemDelete = (id) => {
    if (props.party && props.party.inShop) {
      return;
    } else {
      props.onItemDelete(id);
    }
  };

  const handleOpenShop = () => {
    history.push("/shop", { id: props.auth.uid });
  };


  const handleToggleEquipment = (isOpen) => {
    setEquipmentOpen(isOpen);
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
      <Typography
        variant="h5"
        style={{ width: "100%", textAlign: "center", position: "relative" }}
      >
        Poziom {userLevel}
        <img
          src={uiPaths[props.auth.profile.class]}
          alt="class"
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
        <AvatarCard
          bag={bag}
          profile={props.auth.profile}
          updatePerks={(perks) => setActivePerks(perks)}
        />


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
            <div style={{ marginTop: "1rem", width: "100%" }}>
              {(props.party &&
                props.party.leader &&
                (props.party.leader._id === props.auth.uid ||
                  props.party.leader === props.auth.uid)) ||
                (!props.party.leader && !props.party.members.length) ? (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      marginBottom: "1rem",
                      padding: "0.6rem 1rem",
                      width: "100%",
                    }}
                    onClick={
                      () =>
                        props.setCheckWarning(
                          () => handleOpenShop(),
                          "Otworzenie sklepu",
                          warningActionSources.order
                        )
                    }
                  >
                    Przygoda
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    style={{
                      marginBottom: "1rem",
                      padding: "0.6rem 1rem",
                      width: "100%",
                    }}
                  >
                    Przygoda
                  </Button>
                )}
              <Button
                variant="contained"
                style={{
                  background: "white",
                  padding: "0.6rem 1rem",
                  width: "100%",
                }}
                onClick={() => setEquipmentOpen((prev) => !prev)}
              >
                Ekwipunek
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
      {activePerks.length > 0 && (
        <React.Fragment>
          <Typography variant="h5" className={classes.eqHeading}>
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
        activeMission={props.activeMissionId}
      />

      <NewLevelDrawer
        open={
          props.auth.profile.levelNotifications > 0 &&
          !props.auth.profile.rallyNotifications.isNew &&
          !props.auth.profile.shopNotifications.isNew
        }
        confirmLevel={(attribute) => props.confirmLevel(attribute)}
        userLevel={userLevel}
        levelNotifications={props.auth.profile.levelNotifications}
        attributes={props.auth.profile.attributes}
      />

      <AwardsDialog
        open={
          props.auth.profile.rallyNotifications.isNew &&
          !props.auth.profile.shopNotifications.isNew
        }
        handleClose={() => props.clearRallyAwards()}
        title="Rajd zakończony!"
        notifications={props.auth.profile.rallyNotifications}
      />

      <AwardsDialog
        open={props.auth.profile.shopNotifications.isNew}
        handleClose={() => props.clearShopAwards()}
        title="Przygoda zakończona!"
        notifications={props.auth.profile.shopNotifications}
      />
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    party: state.party,
    activeMissionId: state.mission.activeInstanceId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onItemToggle: (id, category, equipped) =>
      dispatch(toggleItem(id, category, equipped)),
    onItemDelete: (id) => dispatch(deleteItem(id)),
    onPartyUpdate: (params, socketAuthReconnect) =>
      dispatch(updateParty(params, socketAuthReconnect)),
    onRemoveMember: (partyId, memberId) =>
      dispatch(removeMember(partyId, memberId)),
    clearRallyAwards: () => dispatch(clearRallyAwards()),
    clearShopAwards: () => dispatch(clearShopAwards()),
    confirmLevel: (attribute) => dispatch(confirmLevel(attribute)),
    onAuthCheck: () => dispatch(authCheck()),
    setCheckWarning: (action, text, actionType) => dispatch(setCheckWarning(action, text, actionType))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
