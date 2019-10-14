import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";

import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar
}));

const MenuDrawer = ({ menuItems, onClick, width }) => {
  const classes = useStyles();
  return (
    <Drawer variant="permanent" style={{ flexShrink: 0, width }}>
      <div className={classes.toolbar} />
      <List>
        {menuItems.map((menuItem, index) => (
          <ListItem button key={menuItem.title} onClick={(e) => onClick(e, menuItem.title)}>
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText primary={menuItem.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
