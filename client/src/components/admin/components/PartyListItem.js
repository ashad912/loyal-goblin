import React from 'react'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

const PartyListItem = ({party}) => {
    const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
    <ListItem button onClick={() => setOpen(prev => !prev)}>
      <ListItemText primary={party.name} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItem style={{ paddingLeft: "2rem"}}>
          <ListItemText primary={party.leader.name}/>
        </ListItem>
        {party.members.map(member => {
          return (
            <ListItem style={{ paddingLeft: "3rem" }}>
              <ListItemText primary={member.name} />
            </ListItem>
          );
        })}
      </List>
    </Collapse>
  </React.Fragment>
  )
}

export default PartyListItem
