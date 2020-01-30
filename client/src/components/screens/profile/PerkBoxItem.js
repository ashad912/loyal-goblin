import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { perkLabels, dayLabels } from "../../../utils/labels";
import { getValue, getTarget } from "../../../utils/methods";
import { palette } from "../../../utils/definitions";





const PerkBoxItem = ({ perk, isFirst }) => {



  let primaryText = [perkLabels[perk.perkType]]
  if (perk.perkType.startsWith("disc")) {
    primaryText.push(getTarget(perk.perkType, perk.target))
  }
  if (perk.hasOwnProperty("value")) {
    primaryText.push(getValue(perk.perkType, perk.value))
  }

  let secondaryText;
  if (perk.time.length > 0) {
    secondaryText = (
      <div>
        {perk.time.map(time => {
          let timeString = "";
          timeString += dayLabels[time.startDay];
          if (time.startHour !== 12 && time.lengthInHours !== 24) {
            timeString +=
              ", " +
              time.startHour +
              ":00 - " +
              ((time.startHour + time.lengthInHours) % 24) +
              ":00";
          }
          return (
            <p
              style={{ margin: 0 }}
              key={
                perk.perkType +
                perk.value +
                time.day +
                time.startHour +
                time.lengthInHours
              }
            >
              {timeString}
            </p>
          );
        })}
      </div>
    );
  } else {
    secondaryText = <span>Efekt stały</span>;
  }

  return (
    <ListItem style={{ flexDirection: "column", alignItems: 'flex-start', borderTop: isFirst ? "" : palette.border }}>
      <Typography variant="caption">
      {secondaryText}
      </Typography>
      <Grid container justify="flex-start" spacing={1} >
      {primaryText.map((text, index) => {
        return <Grid key={text+index} item ><Typography style={{textAlign: 'center'}}>{text}</Typography></Grid>
      })}
      </Grid>
    </ListItem>
  );
};

export default PerkBoxItem;
