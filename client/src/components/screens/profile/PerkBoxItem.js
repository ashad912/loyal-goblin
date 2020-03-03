import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { perkLabels, dayLabels } from "../../../utils/labels";
import { getValue, getTarget } from "../../../utils/methods";
import { palette } from "../../../utils/definitions";
import { PintoTypography, PintoSerifTypography } from "../../../utils/fonts";





const PerkBoxItem = ({ perk, isFirst }) => {



  let primaryText = [<PintoSerifTypography variant="h6">{perkLabels[perk.perkType]}: </PintoSerifTypography>]
  if (perk.perkType.startsWith("disc")) {
    primaryText.push(<PintoSerifTypography variant="h6" style={{color:palette.primary.main}}>{getTarget(perk.perkType, perk.target)}</PintoSerifTypography>)
  }
  if (perk.hasOwnProperty("value")) {
    primaryText.push(<PintoSerifTypography variant="h6" style={{color:palette.primary.main}}>{getValue(perk.perkType, perk.value)}</PintoSerifTypography>)
  }

  let secondaryText;
  if (perk.time.length > 0) {
    secondaryText = (
      <div>
        {perk.time.slice().reverse().map(time => {
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
    <ListItem style={{ flexDirection: "row", alignItems: 'space-between', borderTop: isFirst ? "" : palette.border, padding:'8px' }}>
      <PintoTypography style={{flexBasis:'25%'}}>
      {secondaryText}
      </PintoTypography>
      <Grid container justify="flex-end" spacing={1} >
      {primaryText.map((text, index) => {
        return <Grid key={text+index} item ><PintoSerifTypography style={{textAlign: 'center'}}>{text}</PintoSerifTypography></Grid>
      })}
      </Grid>
    </ListItem>
  );
};

export default PerkBoxItem;
