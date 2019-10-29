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

import convertBagArrayToCategories from "../../utils/bagArayToCategories";

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

const createTempPlayer = (attributes, bag, equipped) => {
  return {
    firstName: "Mirosław",
    lastName: "Szczepaniak",
    level: 8,
    ...attributes,
    equipment: bag,
    equipped,
    currentExp: 1300,
    currentExpBasis: 2100,
    nextLevelAtExp: 3400
  };
};

const createTempBag = () => {
  return [
    {
      _id: 1,
      owner: 11111,
      itemModel: {
        _id: 101,
        type: {
          _id: 1,
          type: "amulet"
        },
        name: "Diament",
        fluff: "Najlepszy przyjaciel dziewyczyny",
        imgSrc: "diamond-amulet.png"
      }
    },
    {
      _id: 2,
      owner: 11111,
      itemModel: {
        _id: 101,
        type: {
          _id: 1,
          type: "amulet"
        },
        name: "Diament",
        fluff: "Najlepszy przyjaciel dziewyczyny",
        imgSrc: "diamond-amulet.png"
      }
    },
    {
      _id: 3,
      owner: 11111,

      itemModel: {
        _id: 102,
        type: {
          _id: 1,
          type: "amulet"
        },
        name: "Perła",
        fluff: "Perła prosto z lodówki, znaczy z małży",
        imgSrc: "pearl-amulet.png"
      }
    },
    {
      _id: 4,
      owner: 11111,

      itemModel: {
        _id: 201,
        type: {
          _id: 2,
          type: "weapon"
        },
        name: "Krótki miecz",
        fluff: "Przynajmniej nie masz kompleksów",
        imgSrc: "short-sword.png"
      }
    },
    {
      _id: 14,
      owner: 11111,

      itemModel: {
        _id: 202,
        type: {
          _id: 2,
          type: "weapon"
        },
        name: "Wielki miecz",
        fluff: "Zdecydowanie masz kompleksy",
        imgSrc: "short-sword.png",
        class: "warrior",
        perks: [
          {
            _id: 1,
            perkType: "attr-strength",
            target: undefined,
            time: [],
            value: "+1"
          }
        ]
      }
    },
    {
      _id: 20,
      owner: 11111,

      itemModel: {
        _id: 206,
        type: {
          _id: 2,
          type: "weapon"
        },
        name: "Żelazna tarcza",
        fluff: "Twarda na zewnątrz, miękka w środku. Zupełnie jak Ty <3",
        imgSrc: "iron-shield.png",
        class: "warrior",
        perks: [
          {
            _id: 1,
            perkType: "attr-endurance",
            target: undefined,
            time: [],
            value: "-1"
          }
        ]
      }
    },
    {
      _id: 5,
      owner: 11111,

      itemModel: {
        _id: 301,
        type: {
          _id: 3,
          type: "chest"
        },
        name: "Skórzana kurta",
        fluff: "Lale za takimi szaleją",
        imgSrc: "leather-jerkin.png"
      }
    },
    {
      _id: 6,
      owner: 11111,

      itemModel: {
        _id: 401,
        type: {
          _id: 4,
          type: "legs"
        },
        name: "Lniane spodnie",
        fluff: "Zwykłe spodnie, czego jeszcze chcesz?",
        imgSrc: "linen-trousers.png"
      }
    },
    {
      _id: 7,
      owner: 11111,

      itemModel: {
        _id: 501,
        type: {
          _id: 5,
          type: "feet"
        },
        name: "Wysokie buty",
        fluff: "Skórzane, wypastowane, lśniące",
        imgSrc: "high-boots.png"
      }
    },
    {
      _id: 8,
      owner: 11111,

      itemModel: {
        _id: 601,
        type: {
          _id: 6,
          type: "head"
        },
        name: "Czapka z piórkiem",
        fluff: "Wesoła kompaniaaaa",
        imgSrc: "feathered-hat.png"
      }
    },
    {
      _id: 9,
      owner: 11111,

      itemModel: {
        _id: 602,
        type: {
          _id: 6,
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
                _id: 1,
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
                _id: 2,
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
    },
    {
      _id: 10,
      owner: 11111,

      itemModel: {
        _id: 701,
        type: {
          _id: 7,
          type: "ring"
        },
        name: "Pierścień siły",
        fluff: "Całuj mój sygnet potęgi",
        imgSrc: "strength-ring.png",
        perks: [
          {
            _id: 1,
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
  ];
};

const createTempEquipped = () => {
  return {
    head: 9,
    chest: 5,
    weaponRight: 4,
    weaponLeft: 20,
    legs: 6,
    feet: 7,
    ringRight: 10
  };
};

const Profile = props => {
  const classes = useStyles();

  const [player, setPlayer] = React.useState(
    createTempPlayer(
      { str: 4, dex: 2, mag: 1, end: 5 },
      convertBagArrayToCategories(createTempBag()),
      createTempEquipped()
    )
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
    head: "",
    chest: "",
    hands: "",
    legs: "",
    feet: "",
    weaponRight: "",
    weaponLeft: "",
    ringRight: "",
    ringLeft: ""
  });
  //TODO: Main-hand and off-hand weapon
  //TODO: Multiple items of same type

  React.useEffect(() => {
    updateEquippedItems();
  }, []);

  const updateEquippedItems = () => {
    const equipment = {
      head: "",
      chest: "",
      hands: "",
      legs: "",
      feet: "",
      weaponRight: "",
      weaponLeft: "",
      ringRight: "",
      ringLeft: ""
    };
    const perks = [];

    Object.keys(player.equipped).forEach(category => {
      let loadedEquippedItem 
      if(category.startsWith('weapon')  ){
        loadedEquippedItem = player.equipment.weapon.find(
          item => item._id === player.equipped[category]
        );
      }else if(category.startsWith('ring')){
        loadedEquippedItem = player.equipment.ring.find(
          item => item._id === player.equipped[category]
        );
      }else{
        loadedEquippedItem = player.equipment[category].find(
          item => item._id === player.equipped[category]
        );
      }

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
    //TODO: attributes at current time
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
      setAttributeModifiers({ ...attrMods });
    });
  };

  const handleItemToggle = (id, isEquipped, category) => {
    //TODO: Each item needs own ID
    const tempPlayer = { ...player };

    if (category === "weapon") {
      if (!tempPlayer.equipped.weaponRight && !tempPlayer.equipped.weaponLeft) {
        tempPlayer.equipped.weaponRight = id;
      } else if (
        tempPlayer.equipped.weaponRight &&
        !tempPlayer.equipped.weaponLeft
      ) {
        if (tempPlayer.equipped.weaponRight === id) {
          tempPlayer.equipped.weaponRight = "";
        } else {
          tempPlayer.equipped.weaponLeft = id;
        }
      } else if (
        !tempPlayer.equipped.weaponRight &&
        tempPlayer.equipped.weaponLeft
      ) {
        if (tempPlayer.equipped.weaponLeft === id) {
          tempPlayer.equipped.weaponLeft = "";
        } else {
          tempPlayer.equipped.weaponRight = id;
        }
      } else if (
        tempPlayer.equipped.weaponRight &&
        tempPlayer.equipped.weaponLeft
      ) {
        if (tempPlayer.equipped.weaponRight === id) {
          tempPlayer.equipped.weaponRight = "";
        } else {
          tempPlayer.equipped.weaponLeft = "";
        }
      }
    } else if(category === 'ring'){
      if (!tempPlayer.equipped.ringRight && !tempPlayer.equipped.ringLeft) {
        tempPlayer.equipped.ringRight = id;
      } else if (
        tempPlayer.equipped.ringRight &&
        !tempPlayer.equipped.ringLeft
      ) {
        if (tempPlayer.equipped.ringRight === id) {
          tempPlayer.equipped.ringRight = "";
        } else {
          tempPlayer.equipped.ringLeft = id;
        }
      } else if (
        !tempPlayer.equipped.ringRight &&
        tempPlayer.equipped.ringLeft
      ) {
        if (tempPlayer.equipped.ringLeft === id) {
          tempPlayer.equipped.ringLeft = "";
        } else {
          tempPlayer.equipped.ringRight = id;
        }
      } else if (
        tempPlayer.equipped.ringRight &&
        tempPlayer.equipped.ringLeft
      ) {
        if (tempPlayer.equipped.ringRight === id) {
          tempPlayer.equipped.ringRight = "";
        } else {
          tempPlayer.equipped.ringLeft = "";
        }
      }
    }
    else {
      tempPlayer.equipped[category] = isEquipped ? "" : id;
    }

    setPlayer({ ...tempPlayer });
    updateEquippedItems();
    //TODO: Call to backend
  };

  const handleItemDelete = (id, category) => {
    const tempPlayer = { ...player };
    const modifyItemArrayIndex = tempPlayer.equipment[category].findIndex(
      item => {
        return item.itemModel._id === id;
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
          {equippedItems.weaponRight && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.weaponRight}`)}
            />
          )}
          {/* Off-hand weapon */}
          {equippedItems.weaponLeft && (
            <img
              className={classes.avatarImage}
              src={require(`../../assets/avatar/items/${equippedItems.weaponLeft}`)}
              style={{ transform: "scaleX(-1)" }}
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
          <Attribute
            attributeName="Siła"
            attributeValue={player.str}
            attributeModifier={attributeModifiers.str}
          />
          <Attribute
            attributeName="Zręczność"
            attributeValue={player.dex}
            attributeModifier={attributeModifiers.dex}
          />
          <Attribute
            attributeName="Magia"
            attributeValue={player.mag}
            attributeModifier={attributeModifiers.mag}
          />
          <Attribute
            attributeName="Wytrzymałość"
            attributeValue={player.end}
            attributeModifier={attributeModifiers.end}
          />
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
        equipped={player.equipped}
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
