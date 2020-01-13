import React from 'react'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import UserListItem from '../common/UserListItem'

import moment from 'moment'
moment.locale("pl");

const PartyListItem = (props) => {
  const [open, setOpen] = React.useState(false);
  const party = props.party

  const handleDelete = (e, _id, name) => {
    e.stopPropagation()
    props.handleDelete(_id, name)
  }

  

  return (
    <React.Fragment>
    <ListItem button onClick={() => setOpen(prev => !prev)}>
      <Grid item xs={3} style={{textAlign: 'left'}}>
        <ListItemText primary={moment(party.createdAt).format("L, LTS")} />
      </Grid>
      <Grid item xs={5} style={{textAlign: 'center'}}>
        <ListItemText primary={party.name} />
      </Grid>
      <Grid item xs={3} style={{textAlign: 'right'}}>
        <Button color="secondary" onClick={(e) => handleDelete(e, party._id, party.name)}>Usuń drużynę</Button>
      </Grid>
      <Grid item xs={1} style={{textAlign: 'right'}}>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Grid>
    
    </ListItem>
    
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List dense component="div" disablePadding>
        
          <UserListItem user={party.leader} hideBan={true} leaderIcon={true}  style={{ paddingLeft: "2rem"}}/>
        
        {party.members.map(member => {
          return (
            
              <UserListItem user={member} hideBan={true}  style={{ paddingLeft: "3rem" }}/>
            
          );
        })}
      </List>
    </Collapse>
  </React.Fragment>
  )
}

export default PartyListItem
