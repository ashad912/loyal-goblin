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
import { getTarget, getValue } from "../../utils/methods";
import { perkLabels, dayLabels } from "../../utils/labels";
import {itemsPath, palette} from '../../utils/definitions'
import PerkBoxItem from "../screens/profile/PerkBoxItem";
import { PintoSerifTypography,PintoTypography } from "../../utils/fonts";

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
        style={{ background: props.equipped && palette.primary.light}}
        equipped={props.equipped ? 1 : 0}
        onClick={() =>props.inactive ? ()=> {} : props.handleScrollSelect(scroll._id)}
      >
        <ListItemAvatar>
          <img
            style={{ width: "52px", height: "52px" }}
            alt={scroll.itemModel.name}
            src={`${itemsPath}${scroll.itemModel.imgSrc}`}
          />
        </ListItemAvatar>
        <Grid container direction="column">
          <Grid item container>
            <Grid item xs={12}>
              <ListItemText
                disableTypography
    primary={<PintoSerifTypography style={{fontSize:'1.2rem'}}>{scroll.itemModel.name}</PintoSerifTypography>}
                secondary={

                    <PintoTypography style={{color:palette.background.darkGrey}}>
                      {scroll.itemModel.description}
                    </PintoTypography>

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
              }}
            >
              <Typography component="div">
              {scroll.itemModel.perks.map((perk, index) => {
                return (
                  <PerkBoxItem key={perk.perkType+perk.value+perk.id} perk={perk} isFirst={index===0} isEquipment={true} equipped={props.equipped}/>
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
