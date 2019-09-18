import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import Attribute from "./profile/Attribute";
import Equipment from "./profile/Equipment";
import maleBody from "../../assets/avatar/male-body.png";

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1
  },
  avatarCard: {
    flex: 0.9,
    alignSelf: "stretch",
    marginBottom: "1rem",
    display: 'grid',
    grid: '100% 100% '
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
      marginBottom: '1rem'
  }
}));

const createTempPlayer = (attributes, equipment) => {
  return {
    firstName: "Mirosław",
    lastName: "Szczepaniak",
    ...attributes,
    equipment,
    currentExp: 1300,
    nextLevelAtExp: 3400
  };
};

const createTempEquipment = () => {
  return {
    amulets: [
      {
        quantity: 2,
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
        quantity: 1,
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
    weapons: [
      {
        quantity: 1,
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
      }
    ],
    chests: [
      {
        quantity: 1,
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
        quantity: 1,
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
        quantity: 1,
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
    heads: [
      {
        quantity: 1,
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
        quantity: 1,
        itemModel: {
          id: 602,
          type: {
            id: 6,
            type: "head"
          },
          name: "Kaptur czarodzieja",
          fluff: "Kiedyś nosił go czarodziej. Już nie nosi.",
          imgSrc: "wizard-coul.png"
        }
      }
    ],
    rings: [
      {
        quantity: 1,
        itemModel: {
          id: 701,
          type: {
            id: 7,
            type: "ring"
          },
          name: "Pierścień siły",
          fluff: "Całuj mój sygnet potęgi",
          imgSrc: "strength-ring.png"
        }
      }
    ]
  };
};

const Profile = () => {
  const classes = useStyles();

  const player = createTempPlayer(
    { str: 4, dex: 2, mag: 1, cha: 5 },
    createTempEquipment()
  ); //Returned from backend

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.wrapper}
      spacing={2}
    >
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
          {/* {body} */}
          <img src={maleBody} alt="male-body" className={classes.avatarImage} />
          {/* {legs} */}
          <img className={classes.avatarImage}
            src={require(`../../assets/avatar/items/${"linen-trousers.png"}`)}
          />
          {/* {feet} */}
          <img className={classes.avatarImage}
            src={require(`../../assets/avatar/items/${"high-boots.png"}`)}
          />
          {/* {chest} */}
          <img className={classes.avatarImage}
            src={require(`../../assets/avatar/items/${"leather-jerkin.png"}`)}
          />
          {/* {head} */}
          <img className={classes.avatarImage}
            src={require(`../../assets/avatar/items/${"feathered-hat.png"}`)}
          />
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
          <Attribute attributeName="Charyzma" attributeValue={player.cha} />
        </Grid>
      </Grid>
      <Typography variant="h5" className={classes.eqHeading}>Ekwipunek:</Typography>
      <Equipment items={player.equipment} />
    </Grid>
  );
};

export default Profile;
