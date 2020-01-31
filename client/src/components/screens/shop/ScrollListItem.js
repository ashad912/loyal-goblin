import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Menu from "@material-ui/core/Menu";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import { getTarget, getValue } from "../../../utils/methods";
import { perkLabels, dayLabels } from "../../../utils/labels";
import {itemsPath, palette} from '../../../utils/definitions'

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
    marginBottom: "0.2rem",
    fontFamily: "\"Pinto\", \"Helvetica\", \"Arial\", sans-serif"
  },
  optionsIcon: {
    margin: "0 auto"
  }
}));

const ScrollListItem = props => {
  const classes = useStyles();

  const scroll = props.scroll;
  if(scroll){

    return (
      <ListItem
        button
        alignItems="flex-start"
        className={classes.listItem}
        style={{ background: props.equipped && palette.primary.light, borderTop: !props.isFirst && palette.border }}
        equipped={props.equipped ? 1 : 0}
        onClick={() =>props.inactive ? ()=> {} : props.handleScrollSelect(scroll._id)}
      >
        <ListItemAvatar>
          <img
            style={{ width: "32px", height: "32px" }}
            alt={scroll.itemModel.name}
            src={`${itemsPath}${scroll.itemModel.imgSrc}`}
          />
        </ListItemAvatar>
        <Grid container direction="column" style={{color: props.equipped &&  'white'}}>
          <Grid item container>
            <Grid item xs={12}>
              <ListItemText
                disableTypography
                primary={scroll.itemModel.name}
                secondary={
                  <div>
                    <Typography variant="caption">
                      {scroll.itemModel.description}
                    </Typography>
                  </div>
                }
              />
            </Grid>
          </Grid>
          <Grid item style={{width: '100%'}}>
          {scroll.itemModel.perks.length > 0 && (
            <List
              dense
              style={{
                maxHeight: "8rem",
                overflow: "auto",
                width: "100%",
                padding: "0rem",
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.198)"
              }}
            >
              <Typography component="div">
              {scroll.itemModel.perks.map((perk, index) => {
                return (
                  <Box
                  key={JSON.stringify(perk.target)+index}
                    border={0}
                    borderColor="primary.main"
                    style={{ margin: "0.2rem 0", fontSize: "0.8rem" }}
                  >
                    <ListItem style={{padding: '0.4rem'}}>
                      <Grid container justify="flex-start">
                        <Grid item xs={6}>{perkLabels[perk.perkType]}</Grid>
                        <Grid item xs={3}>{getValue(perk.perkType, perk.value)}</Grid>
                        <Grid item xs={3}>
                          {getTarget(perk.perkType, perk.target)}
                        </Grid>
                        <Grid item xs={12}>
                          {perk.time.length > 0 && (
                            <React.Fragment>
                              {perk.time
                                .slice()
                                .reverse()
                                .map((period, index) => (
                                  <Grid
                                    container
                                    key={JSON.stringify(period)+index}
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
                    {scroll.itemModel.perks.length !== index+1 && <Divider />}
                  </Box>
                );
              })}
              </Typography>
            </List>
          )}
        </Grid>
      </Grid>
  
        
      </ListItem>
    );
  }else{
    return null
  }
};

export default ScrollListItem;
