import React from "react";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

import {perkLabels, dayLabels} from '../../utils/labels'
import { getValue, getTarget } from '../../utils/methods';

const ItemsModalListItemPerks = ({perk}) => {
  const hasTime = perk.time.length > 0;
  let timeText;
  if (hasTime) {
    timeText = perk.time.map(time => {
      const startTime =
        "Początek: " +
        dayLabels[time.startDay] +
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
        <Typography style={{fontSize: '0.8rem'}}>
          {perkLabels[perk.perkType]}{" "}
          {getTarget(perk.perkType, perk.target)}
        </Typography>
        </Grid>
        <Grid item>{getValue(perk.perkType, perk.value)}</Grid>
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
