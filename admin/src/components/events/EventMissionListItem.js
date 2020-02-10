import React from "react";
import styled, { keyframes } from "styled-components";
import moment from 'moment'
import Popover from "@material-ui/core/Popover";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PeopleIcon from "@material-ui/icons/People";

import { missionsPath, classThemes, itemsPath } from "../../utils/definitions";


const pulse = keyframes`
  0% {
    background: rgb(255, 255, 255);
  }

  50% {
    background: rgb(171, 171, 171);
  }

  100% {
    background: rgb(255, 255, 255);
  }
`;

const StyledListItem = styled(ListItem)`
  animation: ${pulse}
  ${props => (props.active ? `5s ease-in-out -${parseInt(Math.random()*10)}s infinite` : "none")};
`;

const EventMissionListItem = ({
  event,
  activationDate,
  expiryDate,
  activateNow,
  editEvent,
  copyEvent,
  deleteEvent,
  archiveEvent,
  isLast,
  statusFilter
}) => {
  const [amuletPopover, setAmuletPopover] = React.useState(null);
  const [itemPopover, setItemPopover] = React.useState(null);

  const handleAmuletPopover = event => {
    setAmuletPopover(event.currentTarget);
  };
  const handleItemPopover = event => {
    setItemPopover(event.currentTarget);
  };

  const handleClose = () => {
    setAmuletPopover(null);
    setItemPopover(null);
  };


  let active, archive, isPermanent
  const now = moment()
  if(moment(now).isSameOrAfter(activationDate) && moment(now).isBefore(expiryDate)){
    active = true
  }
  if(moment(now).isAfter(expiryDate)){
    archive = true
  }
  if(moment(moment().add(100, 'y')).isBefore(expiryDate)){
    isPermanent = true
  }

  let shouldRender = false

  switch (statusFilter) {
    case 'all':
      shouldRender = true
      break;
    case 'ready':
      shouldRender = !active  && !archive
      break;
      case 'active':
        shouldRender = active  && !archive
    break;
    case 'running':
    shouldRender = false
    break;
    case 'archive':
      shouldRender = !active && archive
      break;
    default:
      shouldRender = true
      break;
  }

  let awardsDisabled = true
  Object.keys(event.awards).forEach(awardClass => {
    if(event.awards[awardClass].length > 0){
      awardsDisabled = false
    }
  })
  

  return (
    shouldRender ? 
    <React.Fragment>
      <StyledListItem active={active ? 1 : 0}>
        <Grid container direction="column" spacing={2}>
          <Grid item container>
            <Grid item xs={3}>
  <Typography style={{ textAlign: "center" }}>{event.unique ? "- Misja unikalna -" : "- Misja -"}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{active ? "Aktywna" : "Nieaktywna"}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Box display="flex">
                <Typography
                  style={{ marginRight: "1rem" }}
                >{`${event.minPlayers} - ${event.maxPlayers}`}</Typography>{" "}
                <PeopleIcon />
                <Typography style={{ marginLeft: "1rem" }}>
                  Poziom {event.level} |
                  {`  S: ${event.strength} / Z: ${event.dexterity} / M: ${event.magic} / W: ${event.endurance}`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={2}>
              <img alt='' src={missionsPath + event.imgSrc} width={128} />
            </Grid>
            <Grid item container direction="column" xs={6}>
              <Grid item>
                <Typography
                  variant="h5"
                  style={{ fontSize: "1.2rem", fontWeight: "bolder" }}
                >
                  {event.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas publikacji: ${ moment(activationDate).format(
                        "L, LTS"
                      )}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas zakończenia: ${isPermanent ? "misja bezterminowa" : moment(expiryDate).format("L, LTS")}`}</Typography>
              </Grid>
              {!active && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={e => activateNow(event._id)}
                  >
                    Publikuj teraz
                  </Button>
                </Grid>
              )}
            </Grid>
            <Grid
              item
              container
              direction="column"
              //justify="space-around"
              justify="flex-start"
              alignItems="flex-start"
              xs={2}
              spacing={2}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAmuletPopover}
                  disabled={event.amulets.length <= 0}
                >
                  Amulety
                </Button>
                <Popover
                  open={Boolean(amuletPopover)}
                  anchorEl={amuletPopover}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                >
                  <Grid
                    container
                    direction="column"
                    spacing={1}
                    style={{ width: "20vw", padding: "0 1rem 0 1rem" }}
                  >
                    <List dense>

                    {event.amulets.map(amulet => {
                      return (

                          <ListItem
                          style={{ padding: "0" }}
                            key={amulet.itemModel._id}
                          >
                           <ListItemIcon>
                             <img alt="" src={itemsPath + amulet.itemModel.imgSrc} style={{width: '2rem'}} />
                             </ListItemIcon>

                            <ListItemText
                              primary={amulet.itemModel.name}
                              secondary={"x" + amulet.quantity}
                            />

                          </ListItem>
                        );
                    })}
                      </List>

                  </Grid>
                </Popover>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleItemPopover}
                  disabled={awardsDisabled}
                >
                  Nagrody
                </Button>
                <Typography style={{textAlign:'center', marginTop: '0.5rem'}}>
                  +{event.experience} PD
                </Typography>
                {!awardsDisabled && 
                  <Typography style={{marginTop: '0.5rem'}}>
                    {event.awardsAreSecret ? "Nagrody ukryte" : "Nagrody jawne"}
                  </Typography>
                }
        
                <Popover
                  open={Boolean(itemPopover)}
                  anchorEl={itemPopover}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                >
                  <Grid
                    container
                    direction="column"
                    spacing={1}
                    style={{ width: "20vw" }}
                  >
                    {Object.keys(event.awards).map(awardClass => {
                      const data = event.awards[awardClass];
                      if (data.length) {
                        return (
                          <ListItem
                            style={{
                              background: classThemes[awardClass]
                            }}
                            key={awardClass}
                          >
                            <List style={{ padding: "0" }} dense>
                              {data.map(item => {
                                return (
                                  <ListItem
                                  style={{ padding: "0" }}
                                    key={item.itemModel._id}
                                  >
                                   <ListItemIcon>
                                     <img alt="" src={itemsPath + item.itemModel.imgSrc} style={{width: '2rem'}} />
                                     </ListItemIcon>

                                    <ListItemText
                                      primary={item.itemModel.name}
                                      secondary={"x" + item.quantity}
                                    />

                                  </ListItem>
                                );
                              })}
                            </List>
                          </ListItem>
                        );
                      } else {
                        return null;
                      }
                    })}
                    {/* {Object.values(event.awards)
                    .reduce((a, b) => a.concat(b))
                    .map(item => {
                      return (
                        <Grid
                          item
                          style={{
                            background: classThemes[item.itemModel.class]
                          }}
                          key={item._id}
                        >
                          <ListItemText
                            primary={item.itemModel.name}
                            secondary={"x" + item.quantity}
                          />
                        </Grid>
                      );
                    })} */}
                  </Grid>
                </Popover>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={2} spacing={2} alignItems="flex-end">
              <Grid item>
                <Button color="primary" onClick={e => editEvent(event._id)}>
                  Edytuj
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={e => copyEvent(event._id)}>
                  Duplikuj
                </Button>
              </Grid>
              {/* <Grid item>
                <Button onClick={e => archiveEvent(event._id)}>
                  Archiwizuj
                </Button>
              </Grid> */}
              <Grid item>
                <Button onClick={e => deleteEvent(event._id)} color="secondary">
                  Usuń
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </StyledListItem>
      {!isLast && <Divider />}
    </React.Fragment> : null
  );
};

export default EventMissionListItem;
