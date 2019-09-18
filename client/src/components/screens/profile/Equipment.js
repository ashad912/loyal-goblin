import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  listItem: {
    borderTop: "1px solid grey",
    borderBottom: "1px solid grey",
    marginBottom: "0.2rem"
  },
  inline: {
    display: "inline"
  }
}));

const Equipment = props => {
  const [openList, setOpenList] = React.useState("");

  const classes = useStyles();

  const handleOpenList = event => {
    if (event.currentTarget.dataset.value === openList) {
      setOpenList("");
    } else {
      setOpenList(event.currentTarget.dataset.value);
    }
  };

  const items = props.items;

  return (
    <Paper className={classes.root}>
      <List component="nav" className={classes.root}>
        {Object.keys(items).map(itemCategory => (
          <React.Fragment key={itemCategory}>
            <ListItem onClick={handleOpenList} data-value={itemCategory}>
              <ListItemText primary={itemCategory} />
              {openList === itemCategory ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openList === itemCategory}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {items[itemCategory].map(item => (
                  <ListItem
                    key={item.itemModel.id}
                    alignItems="flex-start"
                    className={classes.listItem}
                  >
                    <ListItemAvatar>
                      <img
                        style={{ width: "32px", height: "32px" }}
                        alt={item.itemModel.name}
                        src={require(`../../../assets/icons/items/${item.itemModel.imgSrc}`)}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.itemModel.name}
                      secondary={<span>{item.itemModel.fluff}</span>}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Equipment;
