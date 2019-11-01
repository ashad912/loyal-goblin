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

const ScrollListItem = props => {
  const classes = useStyles();

  const scroll = props.scroll;

  return (
    <ListItem
      button
      alignItems="flex-start"
      className={classes.listItem}
      style={{ background: props.equipped ? "#e6dc8d" : "" }}
      equipped={props.equipped ? 1 : 0}
      onClick={() =>props.inactive ? ()=> {} : props.handleScrollSelect(scroll._id)}
    >
      <ListItemAvatar>
        <img
          style={{ width: "32px", height: "32px" }}
          alt={scroll.itemModel.name}
          src={require(`../../../assets/icons/items/${scroll.itemModel.imgSrc}`)}
        />
      </ListItemAvatar>
      <Grid container direction="column">
        <Grid item container>
          <Grid item xs={12}>
            <ListItemText
              disableTypography
              primary={scroll.itemModel.name}
              secondary={
                <div>
                  <Typography variant="caption">
                    {scroll.itemModel.fluff}
                  </Typography>
                </div>
              }
            />
          </Grid>
        </Grid>
        <Grid item >
          {scroll.itemModel.perks.length > 0 && (
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
              {scroll.itemModel.perks.map((perk, index) => {
                return (
                  <Box
                  key={perk.perkType+index}
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
                        
                      </Grid>
                    </ListItem>
                  </Box>
                );
              })}
            </List>
          )}
        </Grid>
      </Grid>

      
    </ListItem>
  );
};

export default ScrollListItem;
