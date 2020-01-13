import React from "react";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import perkTranslation from "../../../assets/categories/perks";

const ItemsModalListItemPerks = ({perk}) => {
  const hasTime = perk.time.length > 0;
  let timeText;
  if (hasTime) {
    timeText = perk.time.map(time => {
      const startTime =
        "Początek: " +
        perkTranslation[time.startDay] +
        ", godzina " +
        time.startHour+":00";
      const duration = time.hoursFlag
        ? "Czas trwania: " + time.lengthInHours + " h"
        : "Czas trwania: 1 d";
      return (
        <React.Fragment key={perk.perkType+time.startDay+time.duration}>
          <Grid item>
            <Typography style={{fontSize: '0.8rem'}}>{startTime}</Typography>
          </Grid>
          <Grid item>
            <Typography style={{fontSize: '0.8rem'}}>{duration}</Typography>
          </Grid>
        </React.Fragment>
      );
    });
  }

  return (
    <ListItem style={{fontSize: '0.8rem'}}>
      <Grid container spacing={1}>
        <Grid item>
          {perkTranslation[perk.perkType]}{" "}
          {perk.target && " - " + perk.target.name + ":"}
        </Grid>
        <Grid item>{perk.value}</Grid>
        {hasTime && (
          <Grid item container direction="column">
            {timeText}
          </Grid>
        )}
      </Grid>
    </ListItem>
  );
};

export default ItemsModalListItemPerks;
