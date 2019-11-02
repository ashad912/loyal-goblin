import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import perkTypes from "../../../assets/categories/perks";

const PerkBoxItem = ({ perk }) => {
  let primaryText = [perkTypes[perk.perkType]]
  if (perk.hasOwnProperty("value")) {
    primaryText.push(perk.value)
  }
  if (perk.perkType.startsWith("disc")) {
    primaryText.push(perk.target.name)
  }

  let secondaryText;
  if (perk.time.length > 0) {
    secondaryText = (
      <div>
        {perk.time.map(time => {
          let timeString = "";
          timeString += perkTypes[time.startDay];
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
    secondaryText = <span>Efekt ciągły</span>;
  }

  return (
    <ListItem style={{ flexDirection: "column", alignItems: 'flex-start' }}>
      <Grid container justify="flex-start" spacing={2} >
      {primaryText.map((text, index) => {
        return <Grid key={text+index} item ><Typography style={{textAlign: 'center'}}>{text}</Typography></Grid>
      })}
      </Grid>
      <Typography variant="caption">
      {secondaryText}
      </Typography>
    </ListItem>
  );
};

export default PerkBoxItem;
