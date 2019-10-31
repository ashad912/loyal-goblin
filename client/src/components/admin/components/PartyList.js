import React from "react";
import List from "@material-ui/core/List";
import PartyListItem from "./PartyListItem";

const PartyList = ({ partys }) => {


  return (
    <List style={{ border: "1px solid grey" }} alignItems="flex-start">
      {partys.map(party => {
        return <PartyListItem party={party}/>
      })}
    </List>
  );
};

export default PartyList;
