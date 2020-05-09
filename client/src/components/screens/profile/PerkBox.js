import React from "react";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";

import PerkBoxItem from "./PerkBoxItem";

const PerkBox = ({ perks }) => {
  return (
    <Paper style={{ width: "100%"}}>
    <List  >
      {perks.map((perk, index) => {
        return <PerkBoxItem key={perk.perkType+perk.value+perk._id+index} perk={perk} isFirst={index===0} isEquipment={false}/>;
      })}
    </List>
    </Paper>
  );
};

export default PerkBox;
