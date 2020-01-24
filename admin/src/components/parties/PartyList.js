import React from "react";
import List from "@material-ui/core/List";
import PartyListItem from "./PartyListItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

const PartyList = (props) => {


  return (
    <List dense style={{ border: "1px solid grey" }} alignItems="flex-start">
    <ListItem >
        <Grid container style={{alignItems: 'center'}}>
            <Grid item xs={3} style={{textAlign: 'left'}}>
                <Typography style={{width: '100%', fontWeight: 'bold'}}>Data utworzenia</Typography>
            </Grid>
            
            <Grid item xs={5} style={{textAlign: 'center'}}>
                <Typography style={{width: '100%', fontWeight: 'bold'}}>Nazwa drużyny</Typography>
            </Grid>
        </Grid>
    </ListItem>
    {props.parties.map(party => {
      return <PartyListItem party={party} handleDelete={props.handleDelete}/>
    })}
    </List>
  );
};

export default PartyList;
