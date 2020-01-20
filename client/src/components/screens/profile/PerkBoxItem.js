import React from "react";

import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import perkTypes from "../../../assets/categories/perks";
import { categoryLabels, roomLabels } from "../../../utils/labels";





const PerkBoxItem = ({ perk }) => {

  const getValue = (perkType, value) => {
    if(perkType.includes('attr')){
      if(!value.includes('+') && !value.includes('-')){
        return `+${value}`
      }
    }else if(perkType.includes('disc')){
      if(!value.includes('%')){
        return value + " ZŁ"
      }
    }else if(perkType.includes('experience')){
      let modValue = value
      if(!value.includes('+') && !value.includes('-')){
        modValue = `+${value}`
      }
      if(!value.includes('%')){
        modValue += " PD"
      }
      return modValue
    }
  
    return value
  }
  
  
  const getTarget = (perkType, target) => {
    const targetPerks = ['disc-product', 'disc-category', 'disc-rent']
  
    if(targetPerks.includes(perkType)){
      switch(perkType) {
        case 'disc-product':
          return target['disc-product'].name
        case 'disc-category':
          return categoryLabels[target['disc-category']]
        case 'disc-rent':
          return roomLabels[target['disc-rent']]
        default:   
          break
      }
    }
    return null
  }


  let primaryText = [perkTypes[perk.perkType]]
  if (perk.hasOwnProperty("value")) {
    primaryText.push(getValue(perk.perkType, perk.value))
  }
  if (perk.perkType.startsWith("disc")) {
    primaryText.push(getTarget(perk.perkType, perk.target))
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
    secondaryText = <span>Efekt stały</span>;
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
