import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import Grid from "@material-ui/core/Grid";

import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import { palette, itemsPath, uiPaths } from "../../../utils/constants";

import { PintoTypography, PintoSerifTypography } from "../../../assets/fonts";
import PerkBoxItem from "./PerkBoxItem";

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
    let itemId;
    if (props.stacked) {
      itemId = item.instancesIds[0];
    } else {
      itemId = item._id;
    }
    //console.log(itemId, item.itemModel.name, props.itemCategory)
    props.handleItemDelete(itemId, item.itemModel.name, props.itemCategory);
    setAnchorEl(null);
  };

  const quantity =
    item.instancesIds && item.instancesIds.length > 1
      ? item.instancesIds.length
      : null;
  return item ? (
    <ListItem
      button={
        props.itemCategory !== "amulet" && props.itemCategory !== "torpedo"
      }
      alignItems="flex-start"
      className={classes.listItem}
      //style={{ boxShadow: props.equipped ? `inset 0px 0px 22px 3px ${palette.primary.main}`  : "" }}
      style={{
        background: props.equipped ? palette.primary.light : "",
        borderTop: palette.border
      }}
      equipped={props.equipped ? 1 : 0}
      onClick={() =>
        props.itemCategory !== "amulet" &&
        props.itemCategory !== "torpedo" &&
        props.handleItemToggle(
          item._id,
          props.equipped,
          props.itemCategory,
          props.twoHanded
        )
      }
    >
      <Grid container directon="column">
        <Grid item container direction="row" justify="space-between">
          <Grid item xs={4} >
            <Badge
              overlap="circle"
              color="primary"
              badgeContent={quantity}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <ListItemAvatar>
                <img
                  style={{ width: "3.5rem", height: "3.5rem" }}
                  // alt={item.itemModel.name}
                  src={itemsPath + item.itemModel.imgSrc}
                  alt=""
                />
              </ListItemAvatar>
            </Badge>
          </Grid>

          <Grid container direction="column" item xs={8}>
            <Grid item container>
              <Grid item xs={9}>
                <ListItemText
                  disableTypography
                  primary={
                    <PintoSerifTypography style={{fontSize:'1.1rem'}}>
                      {item.itemModel.name}
                    </PintoSerifTypography>
                  }
                  secondary={
                    <div>
                      {props.twoHanded && (
                        <PintoSerifTypography >
                          Broń dwuręczna
                        </PintoSerifTypography>
                      )}
                      <PintoTypography style={{color:palette.background.darkGrey}}>
                        {item.itemModel.description}
                      </PintoTypography>
                    </div>
                  }
                />
              </Grid>
              
              <Grid item xs={2}>
                <ListItemIcon onClick={handleClick}>
                  <Button>
                    <MoreHorizIcon
                      className={classes.optionsIcon}
                      style={{ color: props.equipped ? "white" : "black" }}
                    />
                  </Button>
                </ListItemIcon>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ width: "100%" }}>
          {item.itemModel.perks.length > 0 && (
            <List
              dense
              style={{
                maxHeight: "8rem",
                overflow: "auto",
                width: "100%",
                padding: "0",
                boxSizing: "border-box",
              }}
            >
              <Typography component="div">
                {item.itemModel.perks.map((perk, index) => {
                  return (
                    <PerkBoxItem key={perk.perkType+perk.value+perk.id} perk={perk} isFirst={index===0} isEquipment={true} equipped={props.equipped}/>
                    
                  );
                })}
              </Typography>
            </List>
          )}
        </Grid>
      </Grid>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleDelete}>
          <ListItemIcon>
            <img alt="trash" src={uiPaths.trash} style={{width: '1.5rem', height: '1.5rem'}}/>
          </ListItemIcon>
          <ListItemText><PintoTypography>Wyrzuć</PintoTypography></ListItemText>
        </StyledMenuItem>
      </StyledMenu>
    </ListItem>
  ) : null;
};

export default EquipmentListItem;
