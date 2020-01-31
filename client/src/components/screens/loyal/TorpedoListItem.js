import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import { palette, itemsPath } from "../../../utils/definitions";
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const useStyles = makeStyles(theme => ({
  listItem: {
    borderTop: palette.border,
    marginBottom: "0.2rem"
  },
  optionsIcon: {
    margin: "0 auto"
  }
}));

const TorpedoListItem = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const item = props.item;

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = event => {
    event.stopPropagation();
    props.handleItemDelete(item.instancesIds[0], item.itemModel.name);
    setAnchorEl(null);
  };

  return (
    <ListItem
      button
      key={item._id}
      alignItems="flex-start"
      className={classes.listItem}
      style={{
        background:
          props.loadedTorpedoId === item.instancesIds[0]
            ? palette.primary.light
            : ""
      }}
      loaded={props.loadedTorpedoId === item.instancesIds[0] ? 1 : 0}
      onClick={() => props.handleTorpedoToggle(item.instancesIds[0])}
    >
        <ListItemAvatar>
      <Badge
        color="primary"
        badgeContent={item.instancesIds.length}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        // style={{ marginRight: "1.5rem" }}
        invisible={item.instancesIds.length <= 1}
      >
          <img
            style={{ width: "32px", height: "32px" }}
            alt={item.itemModel.name}
            src={`${itemsPath}${item.itemModel.imgSrc}`}
          />
      </Badge>
        </ListItemAvatar>

      {/* x${} */}
      <ListItemText
      style={{color: props.loadedTorpedoId && 'white'}}
        primary={
          item.instancesIds.length < 2
            ? item.itemModel.name
            : `${item.itemModel.name}`
        }
        secondary={<span style={{color: props.loadedTorpedoId && 'white'}}>{item.itemModel.description}</span>}
      />
      <ListItemIcon onClick={handleClick}>
        <Button>
          <MoreHorizIcon className={classes.optionsIcon} style={{color: props.loadedTorpedoId && 'white'}} />
        </Button>
      </ListItemIcon>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Wyrzuć" />
        </StyledMenuItem>
      </StyledMenu>
    </ListItem>
  );
};

export default TorpedoListItem;
