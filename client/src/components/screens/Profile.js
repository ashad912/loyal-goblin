import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import ColorizeIcon from "@material-ui/icons/Colorize";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";

import Attribute from "./profile/Attribute";
import Equipment from "./profile/Equipment";
import NewLevelDialog from "./profile/NewLevelDialog";
import PerkBox from "./profile/PerkBox";
import maleBody from "../../assets/avatar/male-body.png";

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    position: "relative"
  },
  avatarCard: {
    flex: 0.9,
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

const createTempPlayer = (attributes, equipment) => {
  return {
    firstName: "Mirosław",
    lastName: "Szczepaniak",
    level: 8,
    ...attributes,
    equipment,
    currentExp: 1300,
    currentExpBasis: 2100,
    nextLevelAtExp: 3400
  };
};

const createTempEquipment = () => {
  return {
    amulet: [
      {
        id: 1,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 101,
          type: {
            id: 1,
            type: "amulet"
          },
          name: "Diament",
          fluff: "Najlepszy przyjaciel dziewyczyny",
          imgSrc: "diamond-amulet.png"
        }
      },
      {
        id: 2,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 101,
          type: {
            id: 1,
            type: "amulet"
          },
          name: "Diament",
          fluff: "Najlepszy przyjaciel dziewyczyny",
          imgSrc: "diamond-amulet.png"
        }
      },
      {
        id: 3,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 102,
          type: {
            id: 1,
            type: "amulet"
          },
          name: "Perła",
          fluff: "Perła prosto z lodówki, znaczy z małży",
          imgSrc: "pearl-amulet.png"
        }
      }
    ],
    weapon: [
      {
        id: 4,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 201,
          type: {
            id: 2,
            type: "weapon"
          },
          name: "Krótki miecz",
          fluff: "Przynajmniej nie masz kompleksów",
          imgSrc: "short-sword.png"
        }
      },
      {
        id: 14,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 202,
          type: {
            id: 2,
            type: "weapon"
          },
          name: "Wielki miecz",
          fluff: "Zdecydowanie masz kompleksy",
          imgSrc: "short-sword.png",
          class: "warrior",
          perks: [
            {
              id: 1,
              perkType: "attr-strength",
              target: undefined,
              time: [],
              value: "+1"
            }
          ]
        }
      }
    ],
    chest: [
      {
        id: 5,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 301,
          type: {
            id: 3,
            type: "chest"
          },
          name: "Skórzana kurta",
          fluff: "Lale za takimi szaleją",
          imgSrc: "leather-jerkin.png"
        }
      }
    ],
    legs: [
      {
        id: 6,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 401,
          type: {
            id: 4,
            type: "legs"
          },
          name: "Lniane spodnie",
          fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
          imgSrc: "linen-trousers.png"
        }
      }
    ],
    feet: [
      {
        id: 7,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 501,
          type: {
            id: 5,
            type: "feet"
          },
          name: "Wysokie buty",
          fluff: "Skórzane, wypastowane, lśniące",
          imgSrc: "high-boots.png"
        }
      }
    ],
    head: [
      {
        id: 8,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 601,
          type: {
            id: 6,
            type: "head"
          },
          name: "Czapka z piórkiem",
          fluff: "Wesoła kompaniaaaa",
          imgSrc: "feathered-hat.png"
        }
      },
      {
        id: 9,
        owner: 11111,
        equipped: true,
        itemModel: {
          id: 602,
          type: {
            id: 6,
            type: "head"
          },
          name: "Kaptur czarodzieja",
          fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
          imgSrc: "wizard-coul.png",
          perks: [
            {
              perkType: "experience",
              target: undefined,
              time: [
                {
                  id: 1,
                  hoursFlag: false,
                  lengthInHours: 24,
                  startDay: 5,
                  startHour: 12
                }
              ],
              value: "+10%"
            },
            {
              perkType: "experience",
              target: undefined,
              time: [
                {
                  id: 2,
                  hoursFlag: false,
                  lengthInHours: 24,
                  startDay: 6,
                  startHour: 12
                }
              ],
              value: "+20%"
            }
          ]
        }
      }
    ],
    ring: [
      {
        id: 10,
        owner: 11111,
        equipped: true,
        itemModel: {
          id: 701,
          type: {
            id: 7,
            type: "ring"
          },
          name: "Pierścień siły",
          fluff: "Całuj mój sygnet potęgi",
          imgSrc: "strength-ring.png",
          perks: [
            {
              id: 1,
              perkType: "disc-product",
              target: { name: "Wóda2" },
              time: [
                {
                  hoursFlag: true,
                  lengthInHours: 2,
                  startDay: 1,
                  startHour: 18
                },
                { hoursFlag: true, lengthInHours: 5, startDay: 3, startHour: 7 }
              ],
              value: "-15%"
            }
          ]
        }
      }
    ]
  };
};

const Profile = props => {
  const classes = useStyles();

  const [player, setPlayer] = React.useState(
    createTempPlayer({ str: 4, dex: 2, mag: 1, end: 5 }, createTempEquipment())
  ); //Returned from backend

  const [activePerks, setActivePerks] = React.useState([]);

  const [attributeModifiers, setAttributeModifiers] = React.useState({
    str: 0,
    dex: 0,
    mag: 0,
    end: 0
  });

  const [goExp, setGoExp] = React.useState(false);

  const [newLevelDialogOpen, setNewLevelDialogOpen] = React.useState(false);

  const [equippedItems, setEquippedItems] = React.useState({
    amulet: "",
    head: "",
    chest: "",
    hands: "",
    legs: "",
    feet: "",
    weapon: "",
    ring: ""
  });
  //TODO: Main-hand and off-hand weapon
  //TODO: Multiple items of same type

  React.useEffect(() => {
    updateEquippedItems();
  }, []);



  const updateEquippedItems = () => {
    const equipment = {
      amulet: "",
      head: "",
      chest: "",
      hands: "",
      legs: "",
      feet: "",
      weapon: "",
      ring: ""
    };
    const perks = [];

    Object.keys(player.equipment).forEach(category => {
      const loadedEquippedItem = player.equipment[category].find(
        item => item.equipped
      );
      if (loadedEquippedItem) {
        equipment[category] = loadedEquippedItem.itemModel.imgSrc;
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

    const attrMods = { str: 0, dex: 0, mag: 0, end: 0 };
    perks.forEach(perk => {
      if (perk.perkType.startsWith("attr")) {
        //TODO: handle percentage change
        switch (perk.perkType) {
          case "attr-strength":
            attrMods.str += parseInt(perk.value);
            break;
          case "attr-dexterity":
            attrMods.dex += parseInt(perk.value);
            break;
          case "attr-magic":
            attrMods.mag += parseInt(perk.value);
            break;
          case "attr-endurance":
            attrMods.end += parseInt(perk.value);
            break;

          default:
            break;
        }
      }
      setAttributeModifiers({...attrMods})
    });
  };

  const handleItemToggle = (id, isEquipped, category) => {
    //TODO: Each item needs own ID
    const tempPlayer = { ...player };
    const modifyItemArrayIndex = tempPlayer.equipment[category].findIndex(
      item => {
        return item.itemModel.id === id;
      }
    );

    //TODO: Handle 2 weapons and rings
    tempPlayer.equipment[category].forEach(item => (item.equipped = false));
    tempPlayer.equipment[category][modifyItemArrayIndex].equipped = !isEquipped;
    setPlayer({ ...tempPlayer });
    updateEquippedItems();
    //TODO: Call to backend
  };

  const handleItemDelete = (id, category) => {
    const tempPlayer = { ...player };
    const modifyItemArrayIndex = tempPlayer.equipment[category].findIndex(
      item => {
        return item.itemModel.id === id;
      }
    );

    tempPlayer.equipment[category].splice(modifyItemArrayIndex, 1);
    setPlayer({ ...tempPlayer });
    updateEquippedItems();

    //TODO: Call to backend
  };

  const handleAddExperience = newExp => {
    const tempPlayer = { ...player };
    if (tempPlayer.currentExp + newExp >= tempPlayer.nextLevelAtExp) {
      setPlayer({ ...handleNewLevel(tempPlayer) });
      setNewLevelDialogOpen(true);
    } else {
      tempPlayer.currentExp += newExp;
      setPlayer({ ...tempPlayer });
    }
  };

  const handleNewLevel = player => {
    player.level++;
    player.currentExp = player.nextLevelAtExp - player.currentExp;
    const tempCurrentExpBasis = player.nextLevelAtExp;
    player.nextLevelAtExp = player.currentExpBasis + player.nextLevelAtExp;
    player.currentExpBasis = tempCurrentExpBasis;

    //TODO: call back end

    return player;
  };

  const handleNewLevelDialogClose = attribute => {
    setNewLevelDialogOpen(false);
    const tempPlayer = { ...player };
    tempPlayer[attribute]++;
    setPlayer({ ...tempPlayer });
  };

  // const handleGoExp = () => {
  //   console.log(props.location.push('shop'));
  //   setGoExp(prev => !prev);
  // };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.wrapper}
      spacing={2}
    >
      <Typography variant="h5">Poziom: {player.level}</Typography>
      <Typography variant="subtitle2">
        Doświadczenie: {player.currentExp + " / " + player.nextLevelAtExp}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(player.currentExp * 100) / player.nextLevelAtExp}
        className={classes.expBar}
      />
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Paper xs={8} className={classes.avatarCard}>
          {/* body */}
          <img src={maleBody} alt="male-body" className={classes.avatarImage} />
          {/* legs */}
          {equippedItems.legs && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.legs}`)}
            />
          )}
          {/* feet */}
          {equippedItems.feet && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.feet}`)}
            />
          )}
          {/* chest */}
          {equippedItems.chest && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.chest}`)}
            />
          )}
          {/* head */}
          {equippedItems.head && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.head}`)}
            />
          )}
          {/* Main-hand weapon */}
          {equippedItems.weapon && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.weapon}`)}
            />
          )}
        </Paper>
        <Grid
          container
          item
          xs={4}
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <Attribute attributeName="Siła" attributeValue={player.str} attributeModifier={attributeModifiers.str}/>
          <Attribute attributeName="Zręczność" attributeValue={player.dex } attributeModifier={attributeModifiers.dex}/>
          <Attribute attributeName="Magia" attributeValue={player.mag } attributeModifier={attributeModifiers.mag}/>
          <Attribute attributeName="Wytrzymałość" attributeValue={player.end } attributeModifier={attributeModifiers.end}/>
          <Button onClick={() => handleAddExperience(500)}>Dodaj expa</Button>
          <Button>Dodaj amulet</Button>
          <Link to="/shop">
            <Button variant="contained" color="primary">
              Idziemy expić!
              <ColorizeIcon
                style={{
                  fontSize: "2rem",
                  transition: "transform 500ms ease-out",
                  transform: goExp ? "rotate(540deg)" : "rotate(180deg)"
                }}
              />
            </Button>
          </Link>
        </Grid>
      </Grid>
      {activePerks.length > 0 && (
        <React.Fragment>
          <Typography variant="h5" className={classes.eqHeading}>
            Aktualne efekty:
          </Typography>
          <PerkBox perks={activePerks} />
        </React.Fragment>
      )}
      <Typography variant="h5" className={classes.eqHeading}>
        Ekwipunek:
      </Typography>
      <Equipment
        items={player.equipment}
        handleItemToggle={handleItemToggle}
        handleItemDelete={handleItemDelete}
      />
      <Typography variant="h5" className={classes.eqHeading}>
        Znajomi i drużyna:
      </Typography>
      <Fab color="primary">
        <PeopleAltIcon />
      </Fab>
      <Typography variant="h5" className={classes.eqHeading}>
        Statystyki:
      </Typography>

      <NewLevelDialog
        open={newLevelDialogOpen}
        handleAddAndClose={handleNewLevelDialogClose}
      />
    </Grid>
  );
};

export default Profile;
