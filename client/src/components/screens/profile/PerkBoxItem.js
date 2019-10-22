import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

import perkTypes from "../../../assets/categories/perks";

const PerkBoxItem = ({ perk }) => {
  let primaryText = perkTypes[perk.perkType];
  if (perk.perkType.startsWith("disc")) {
    primaryText += ": " + perk.target.name;
  }
  if (perk.hasOwnProperty("value")) {
    primaryText += " " + perk.value;
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
          return <p style={{margin: 0}} key={time.day+time.startHour+time.lengthInHours}>{timeString}</p>
        }
        )}
      </div>
    );
  } else {
    secondaryText = <p>Efekt ciągły</p>;
  }

  return (
    <ListItem style={{flexDirection: 'column'}}> 
        <div component="p">{primaryText}</div>
        {secondaryText}
      
    </ListItem>
  );
};

export default PerkBoxItem;
