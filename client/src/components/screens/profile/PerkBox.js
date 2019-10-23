import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import PerkBoxItem from "./PerkBoxItem";

const PerkBox = ({ perks }) => {
  return (
    <List style={{ width: "100%", border: "2px solid grey" }}>
      {perks.map(perk => {
        return <PerkBoxItem key={perk.perkType+perk.value+perk.id} perk={perk} />;
      })}
    </List>
  );
};

export default PerkBox;
