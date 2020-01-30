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
import {itemsPath} from '../../../utils/definitions'
import { getValue, getTarget } from "../../../utils/methods";



const AwardListItem = props => {

  const item = props.item;
  const quantity = item.quantity && item.quantity > 1 ? item.quantity : null

  return (
    <ListItem
      alignItems="flex-start"
      style={{
        border: "1px solid rgb(63, 81, 181)",
        width: '100%',
        marginBottom: "0.2rem",
        padding: '1rem'
      }}
    >
    <Grid container direction="column">
    <Grid item>
        <Grid container direction="row">
        <Grid item xs={3}>
            <Badge overlap="circle" color="primary" badgeContent={quantity} anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} style={{marginRight: '0.5rem'}}>

            <ListItemAvatar>
                <img
                style={{ width: "32px", height: "32px" }}
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
                        {item.itemModel.description}
                    </Typography>
                    </div>
                }
                />
            </Grid>

            </Grid>
            
        </Grid>
        </Grid>
        </Grid>
      </Grid>
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
                border: "1px solid grey",
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.198)"
              }}
            >
            <Typography component="div">
              {item.itemModel.perks.map((perk, index) => {
                return (
                  <Box
                  key={JSON.stringify(perk.target)+index}
                    border={0}
                    borderColor="primary.main"
                    style={{ margin: "0.2rem 0", fontSize: "0.8rem" }}
                  >
                    <ListItem style={{padding: '0.5rem'}}>
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
                                .map(period => (
                                  <Grid
                                    container
                                    
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
                    {item.itemModel.perks.length !== index+1 && <Divider />}
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
};

export default AwardListItem;
