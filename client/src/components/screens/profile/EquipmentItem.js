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
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import perkLabels from "../../../assets/categories/perks";
import { dayLabels, categoryLabels } from "../../../utils/labels";

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
    props.handleItemDelete(item._id, item.itemModel.name, props.itemCategory);
    setAnchorEl(null);
  };

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
      <ListItemAvatar>
        <img
          style={{ width: "32px", height: "32px" }}
          alt={item.itemModel.name}
          src={require(`../../../assets/icons/items/${item.itemModel.imgSrc}`)}
        />
      </ListItemAvatar>
      <Grid container direction="column">
        <Grid item container>
          <Grid item xs={10}>
            <ListItemText
              disableTypography
              primary={item.itemModel.name}
              secondary={
                <div>
                  {item.itemModel.hasOwnProperty("twoHanded") &&
                    item.itemModel.twoHanded && (
                      <Typography variant="subtitle2">
                        Broń dwuręczna
                      </Typography>
                    )}
                  <Typography variant="caption">
                    {item.itemModel.fluff}
                  </Typography>
                </div>
              }
            />
          </Grid>
          <Grid item xs={2}>
            <ListItemIcon onClick={handleClick}>
              <Button>
                <MoreHorizIcon className={classes.optionsIcon} />
              </Button>
            </ListItemIcon>
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
                    border={1}
                    borderColor="primary.main"
                    style={{ margin: "0.2rem 0", fontSize: "0.8rem" }}
                  >
                    <ListItem>
                      <Grid container justify="space-around">
                        <Grid item>{perkLabels[perk.perkType]}</Grid>
                        <Grid item>{perk.value}</Grid>
                        <Grid item>
                          {perk.target
                            ? perk.target.name
                              ? perk.target.name
                              : categoryLabels[perk.target]
                            : null}
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
