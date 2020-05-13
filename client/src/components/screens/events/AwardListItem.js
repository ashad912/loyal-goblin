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
import Badge from '@material-ui/core/Badge';
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TouchAppIcon from '@material-ui/icons/TouchApp';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Divider from '@material-ui/core/Divider';
import { dayLabels, categoryLabels, roomLabels, perkLabels } from "../../../utils/labels";
import {itemsPath, palette} from '../../../utils/definitions'
import { getValue, getTarget } from "../../../utils/methods";
import { PintoTypography } from "../../../utils/fonts";
import PerkBoxItem from "../profile/PerkBoxItem";


const AwardListItem = props => {

  const item = props.item;
  const quantity = item.quantity && item.quantity > 1 ? item.quantity : null

  return (
    <ListItem
      alignItems="flex-start"
      style={{
        width: '100%',
        marginBottom: "0.2rem",
        padding: `${props.disableUpDownPadding ? '0 1rem': '1rem'}`,
        //borderTop: palette.border
      }}
    >
    <Grid container direction="column">
    <Grid item>
        <Grid container direction="row">
        <Grid item xs={3}>
            <Badge overlap="circle" color="primary" badgeContent={quantity} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} style={{marginRight: '0.5rem'}}>

            <ListItemAvatar>
                <img
                  style={{ width: `${props.smallAvatar ? '3rem': '3.5rem'}`, height: `${props.smallAvatar ? '3rem': '3.5rem'}` }}
                  alt={item.itemModel.name}
                  src={`${itemsPath}${item.itemModel.imgSrc}`}
                />
            </ListItemAvatar>
        </Badge>
        </Grid>
        <Grid item xs={9} style={{paddingLeft: '0.5rem'}}>
        <Grid container direction="column">
            <Grid item container>
            <Grid item xs={12}>
                <ListItemText
                primary={
                  <Typography style={{fontSize: '1.1rem', fontFamily: `${props.alternativeFont ? 'Pinto-0' : 'Pinto-3'}`}}>
                    {item.itemModel.name}
                  </Typography>

                  
                }
                secondary={
                    <div>
                    {item.itemModel.hasOwnProperty("twoHanded") &&
                        item.itemModel.twoHanded && (
                        <Typography variant="subtitle2">
                            Broń dwuręczna
                        </Typography>
                        )}
                    <PintoTypography variant="caption">
                        {item.itemModel.description}
                    </PintoTypography>
                    </div>
                }
                />
            </Grid>

            </Grid>
            
        </Grid>
        </Grid>
        </Grid>
      </Grid>
      {!props.perksDisable && (
        <Grid item >
          {item.itemModel.perks.length > 0 && (
            <List
              dense
              style={{
                maxHeight: "8rem",
                overflow: "auto",
                width: "100%",
                padding: '0',
                marginTop: '0.5rem',
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.198)"
              }}
            >
            <Typography component="div">
              {item.itemModel.perks.map((perk, index) => {
                return (
                  <PerkBoxItem key={perk.perkType+perk.value+perk._id} perk={perk} isFirst={index===0} isEquipment={true} equipped={false}/>
                  
                );
              })}
              </Typography>
            </List>
          )}
        </Grid>
      )}
      </Grid>
      
    </ListItem>
  );
};

export default AwardListItem;
