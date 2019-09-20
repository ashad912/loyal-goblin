import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ColorizeIcon from "@material-ui/icons/Colorize";

import Attribute from "./profile/Attribute";
import Equipment from "./profile/Equipment";
import NewLevelDialog from "./profile/NewLevelDialog";
import maleBody from "../../assets/avatar/male-body.png";

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1
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
    marginBottom: "1rem"
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
          description: "Najlepszy przyjaciel dziewyczyny",
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
          description: "Najlepszy przyjaciel dziewyczyny",
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
          description: "Perła prosto z lodówki, znaczy z małży",
          imgSrc: "pearl-amulet.png",
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
          description: "Przynajmniej nie masz kompleksów",
          imgSrc: "short-sword.png",
        }
      }
    ],
    chest: [
      {
        id: 5,
        owner: 11111,
        equipped: true,
        itemModel: {
          id: 301,
          type: {
            id: 3,
            type: "chest"
          },
          name: "Skórzana kurta",
          description: "Lale za takimi szaleją",
          imgSrc: "leather-jerkin.png",
        }
      }
    ],
    legs: [
      {
        id: 6,
        owner: 11111,
        equipped: true,
        itemModel: {
          id: 401,
          type: {
            id: 4,
            type: "legs"
          },
          name: "Lniane spodnie",
          description: "Zwykłe spodnie, czego jeszcze chcesz?",
          imgSrc: "linen-trousers.png",
        }
      }
    ],
    feet: [
      {
        id: 7,
        owner: 11111,
        equipped: true,
        itemModel: {
          id: 501,
          type: {
            id: 5,
            type: "feet"
          },
          name: "Wysokie buty",
          description: "Skórzane, wypastowane, lśniące",
          imgSrc: "high-boots.png",
        }
      }
    ],
    head: [
      {
        id: 8,
        owner: 11111,
        equipped: true,
        itemModel: {
          id: 601,
          type: {
            id: 6,
            type: "head"
          },
          name: "Czapka z piórkiem",
          description: "Wesoła kompaniaaaa",
          imgSrc: "feathered-hat.png",
        }
      },
      {
        id: 9,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 602,
          type: {
            id: 6,
            type: "head"
          },
          name: "Kaptur czarodzieja",
          description: "Kiedyś nosił go czarodziej. Już nie nosi.",
          imgSrc: "wizard-coul.png",
        }
      }
    ],
    ring: [
      {
        id: 10,
        owner: 11111,
        equipped: false,
        itemModel: {
          id: 701,
          type: {
            id: 7,
            type: "ring"
          },
          name: "Pierścień siły",
          description: "Całuj mój sygnet potęgi",
          imgSrc: "strength-ring.png",
        }
      }
    ]
  };
};

const Profile = () => {
  const classes = useStyles();

  const [player, setPlayer] = React.useState(
    createTempPlayer({ str: 4, dex: 2, mag: 1, end: 5 }, createTempEquipment())
  ); //Returned from backend

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


  //TODO-PILNE: Czy trzeba przejść przez cały obiekt bag (z db), ustawiając equipped według obiektu equipped (z db)?
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

    Object.keys(player.equipment).forEach(category => {
      const loadedEquippedItem = player.equipment[category].find(
        item => item.equipped
      );
      if (loadedEquippedItem) {
        equipment[category] = loadedEquippedItem.itemModel.imgSrc;
      }
    });
    console.log(equipment);
    setEquippedItems({ ...equipment });
  };

  const handleItemToggle = (id, isEquipped, category) => {
    console.log(id)
    const tempPlayer = { ...player };
    const modifyItemArrayIndex = tempPlayer.equipment[category].findIndex(
      item => {
        return item.id === id;
      }
    );

    //TODO: Handle 2 weapons and rings
    tempPlayer.equipment[category].forEach(
      item => (item.equipped = false)
    );
    tempPlayer.equipment[category][
      modifyItemArrayIndex
    ].equipped = !isEquipped;
    setPlayer({ ...tempPlayer });
    updateEquippedItems();
    //TODO: Call to backend
  };

  const handleItemDelete = (id, category) => {
    const tempPlayer = { ...player };

    tempPlayer.equipment[category] = tempPlayer.equipment[category].filter(
      item => {
        return item.id !== id;
      }
    )
    setPlayer(  tempPlayer  );
    updateEquippedItems();

    //TODO: Call to backend
  };

  const handleAddExperience = newExp => {
    const tempPlayer = { ...player };
    if (tempPlayer.currentExp + newExp >= tempPlayer.nextLevelAtExp) {
      tempPlayer.currentExp += newExp;
      setPlayer({ ...handleNewLevel(tempPlayer) });
      setNewLevelDialogOpen(true);
    } else {
      tempPlayer.currentExp += newExp;
      setPlayer({ ...tempPlayer });
    }
  };

  const handleNewLevel = player => {
    console.log()
    player.level++;
    player.currentExp = player.currentExp - player.nextLevelAtExp;
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

  const handleGoExp = () => {
    console.log(goExp);
    setGoExp(prev => !prev);
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
          <Attribute attributeName="Siła" attributeValue={player.str} />
          <Attribute attributeName="Zręczność" attributeValue={player.dex} />
          <Attribute attributeName="Magia" attributeValue={player.mag} />
          <Attribute attributeName="Wytrzymałość" attributeValue={player.end} />
          <Button onClick={() => handleAddExperience(500)}>Dodaj expa</Button>
          <Button>Dodaj amulet</Button>
          <Button onClick={handleGoExp} variant="contained" color="primary">
            Idziemy expić!
            <ColorizeIcon
              style={{
                fontSize: "2rem",
                transition: "transform 500ms ease-out",
                transform: goExp ? "rotate(540deg)" : "rotate(180deg)"
              }}
            />
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h5" className={classes.eqHeading}>
        Ekwipunek:
      </Typography>
      <Equipment
        items={player.equipment}
        handleItemToggle={handleItemToggle}
        handleItemDelete={handleItemDelete}
      />

      <NewLevelDialog
        open={newLevelDialogOpen}
        handleAddAndClose={handleNewLevelDialogClose}
      />
    </Grid>
  );
};

export default Profile;
