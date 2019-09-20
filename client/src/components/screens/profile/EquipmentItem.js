import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
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
    borderTop: "1px solid grey",
    borderBottom: "1px solid grey",
    marginBottom: "0.2rem",
  },
  optionsIcon: {
    margin: "0 auto"
  }
}));

const EquipmentListItem = props => {
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
    props.handleItemDelete(item.id, item.itemModel.name, props.itemCategory)  
    setAnchorEl(null);
  }


  return (
    <ListItem
      button
      key={item.itemModel.id}
      alignItems="flex-start"
      className={classes.listItem}
      style={{ background: item.equipped ? "#e6dc8d" : "" }}
      equipped={item.equipped ? 1 : 0}
      onClick={() =>
        props.handleItemToggle(
          item.id,
          item.equipped,
          props.itemCategory
        )
      }
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
        secondary={<span>{item.itemModel.description}</span>}
      />
      <ListItemIcon onClick={handleClick}>
        <Button >
          <MoreHorizIcon className={classes.optionsIcon} />
        </Button>
      </ListItemIcon>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        
      >
        <StyledMenuItem onClick={handleDelete} >
          <ListItemIcon >
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Wyrzuć" />
        </StyledMenuItem>

      </StyledMenu>
    </ListItem>
  );
};

export default EquipmentListItem;
