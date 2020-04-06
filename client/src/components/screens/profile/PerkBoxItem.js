import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { perkLabels, dayLabels } from "../../../utils/labels";
import { getValue, getTarget } from "../../../utils/methods";
import { palette } from "../../../utils/definitions";
import { PintoTypography, PintoSerifTypography } from "../../../utils/fonts";





const PerkBoxItem = ({ perk, isFirst, isEquipment, equipped }) => {



  let primaryText = [<Typography style={{fontFamily: isEquipment ? 'Pinto-0' : 'Pinto-3',fontSize: isEquipment ? '1rem':'1.1rem', }}>{perkLabels[perk.perkType]}:<span>&nbsp;&nbsp;</span> </Typography>]
  if (perk.perkType.startsWith("disc")) {
    primaryText.push(<Typography style={{fontFamily: isEquipment ? 'Pinto-0' : 'Pinto-3',fontSize: isEquipment ? '1rem':'1.1rem', color: equipped? 'white' : palette.primary.main}}>{getTarget(perk.perkType, perk.target)}<span>&nbsp;&nbsp;</span></Typography>)
  }
  if (perk.hasOwnProperty("value")) {
    primaryText.push(<Typography style={{fontFamily: isEquipment ? 'Pinto-0' : 'Pinto-3',fontSize: isEquipment ? '1rem':'1.1rem', color: equipped? 'white' : palette.primary.main}}>{getValue(perk.perkType, perk.value)}</Typography>)
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
            <PintoTypography
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
            </PintoTypography>
          );
        })}
      </div>
    );
  } else {
    secondaryText = <PintoTypography>Efekt stały</PintoTypography>;
  }

  return (
    <ListItem style={{ flexDirection: "row", alignItems: 'space-between', borderTop: isFirst ? "" : isEquipment ? '1px solid black':palette.border, padding: isEquipment ? '0' : '8px', boxSizing:'border-box' }}>
      <span style={{flexBasis:isEquipment?'35%':'25%'}}>
        {secondaryText}
      </span>
      <Grid container justify="flex-end"  >
      {primaryText.map((text, index) => {
        return <Grid key={text+index} item ><span>{text}</span></Grid>
      })}
      </Grid>
    </ListItem>
  );
};

export default PerkBoxItem;
