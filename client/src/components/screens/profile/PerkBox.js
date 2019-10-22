import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import PerkBoxItem from "./PerkBoxItem";

const PerkBox = ({ items }) => {
  return (
    <List style={{width: '100%', border: '2px solid grey'}}>
      {items.map(item => {
        return (
          <ListItem key={item.itemModel.id}>
            <List style={{width: '100%', border: '1px solid grey'}}>
              {item.itemModel.hasOwnProperty("perks") &&
                item.itemModel.perks.length > 0 &&
                item.itemModel.perks.map(perk => {
                  return <PerkBoxItem key={perk.id} perk={perk} />;
                })}
            </List>
          </ListItem>
        );
      })}
    </List>
  );
};

export default PerkBox;
