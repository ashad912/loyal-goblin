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
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TouchAppIcon from "@material-ui/icons/TouchApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { dayLabels, categoryLabels, perkLabels } from "../../../utils/labels";
import { itemsPath } from "../../../utils/definitions";
import { getValue, getTarget } from "../../../utils/methods";

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
    borderTop: "1px solid grey",
    borderBottom: "1px solid grey",
    marginBottom: "0.2rem"
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
  return (
    <ListItem
      button={props.itemCategory !== "amulet"}
      alignItems="flex-start"
      className={classes.listItem}
      style={{ background: props.equipped ? "#e6dc8d" : "" }}
      equipped={props.equipped ? 1 : 0}
      onClick={() =>
        props.itemCategory !== "amulet" &&
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
          <Grid item xs={3}>
              <Badge
                overlap="circle"
                color="primary"
                badgeContent={quantity}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                style={{ marginRight: "0.5rem" }}
              >
                <ListItemAvatar>
                  <img
                    style={{ width: "4rem", height: "4rem" }}
                    alt={item.itemModel.name}
                    src={itemsPath + item.itemModel.imgSrc}
                  />
                </ListItemAvatar>
              </Badge>
          </Grid>

            <Grid container direction="column" item xs={9}>
              <Grid item container>
                <Grid item xs={9}>
                  <ListItemText
                    disableTypography
                    primary={item.itemModel.name}
                    secondary={
                      <div>
                        {props.twoHanded && (
                            <Typography variant="subtitle2">
                              Broń dwuręczna
                            </Typography>
                          )}
                        <Typography variant="caption">
                          {item.itemModel.description}
                        </Typography>
                      </div>
                    }
                  />
                </Grid>
                {props.itemCategory !== "amulet" && (
                  <Grid item xs={1}>
                    <TouchAppIcon />
                  </Grid>
                )}
                <Grid item xs={2}>
                  <ListItemIcon onClick={handleClick}>
                    <Button>
                      <MoreHorizIcon className={classes.optionsIcon} />
                    </Button>
                  </ListItemIcon>
                </Grid>
              </Grid>
            </Grid>
          
        </Grid>
        <Grid item>
          {item.itemModel.perks.length > 0 && (
            <List
              dense
              style={{
                maxHeight: "8rem",
                overflow: "auto",
                width: "100%",
                border: "1px solid grey",
                padding: "0.5rem",
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.198)"
              }}
            >
              {item.itemModel.perks.map((perk, index) => {
                return (
                  <Box
                    key={perk._id}
                    border={1}
                    borderColor="primary.main"
                    style={{ margin: "0.2rem 0", fontSize: "0.8rem" }}
                  >
                    <ListItem>
                      <Grid container justify="space-around">
                        <Grid item>{perkLabels[perk.perkType]}</Grid>
                        <Grid item>{getValue(perk.perkType, perk.value)}</Grid>
                        <Grid item>
                          {getTarget(perk.perkType, perk.target)}
                        </Grid>
                        <Grid item>
                          {perk.time.length > 0 && (
                            <React.Fragment>
                              {perk.time
                                .slice()
                                .reverse()
                                .map(period => (
                                  <Grid
                                    container
                                    key={JSON.stringify(period)}
                                    style={{ justifyContent: "center" }}
                                  >
                                    <Grid item>
                                      {`${dayLabels[period.startDay]}`}
                                    </Grid>
                                    {!(
                                      period.startHour === 12 &&
                                      period.lengthInHours === 24
                                    ) ? (
                                      <Grid item>
                                        {`, ${
                                          period.startHour
                                        }:00 - ${(period.startHour +
                                          period.lengthInHours) %
                                          24}:00`}
                                      </Grid>
                                    ) : null}
                                  </Grid>
                                ))}
                            </React.Fragment>
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  </Box>
                );
              })}
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
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary="Wyrzuć" />
        </StyledMenuItem>
      </StyledMenu>
    </ListItem>
  );
};

export default EquipmentListItem;
