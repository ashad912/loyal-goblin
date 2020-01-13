import React from "react";
import styled, { keyframes } from "styled-components";
import moment from 'moment'
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import classThemes from "../../../assets/themes/classThemes";
import "moment/locale/pl";

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
  border: 2px solid rgb(158, 0, 0);
`;

const EventRallyListItem = ({
  event,
  activationDate,
  startDate,
  expiryDate,
  activateNow,
  editEvent,
  deleteEvent,
  archiveEvent,
  isLast,
  statusFilter
}) => {
  const [itemPopover, setItemPopover] = React.useState(null);

  const handleItemPopover = event => {
    setItemPopover(event.currentTarget);
  };

  const handleClose = () => {
    setItemPopover(null);
  };


  let active, running, archive
  const now = moment()
  if(moment(activationDate).isSameOrAfter(now) && moment(expiryDate).isAfter(now)){
    active = true
    if(moment(startDate).isSameOrAfter(now)){
      running = true
    }
  }
  if(moment(activationDate).isBefore(now)){
    archive = true
  }

  let shouldRender = false

  switch (statusFilter) {
    case 'all':
      shouldRender = true
      break;
    case 'ready':
      shouldRender = !active && !running && !archive
      break;
      case 'active':
        shouldRender = active && !running && !archive
    break;
    case'running':
    shouldRender = active && running && !archive
    break;
    case 'archive':
      shouldRender = !active && !running && archive
      break;
    default:
      shouldRender = true
      break;
  }
  
  return (
    shouldRender ? 
    <React.Fragment>
      <StyledListItem active={active ? 1 : 0}>
        <Grid container direction="column" spacing={2}>
          <Grid item container>
            <Grid item xs={3}>
              <Typography style={{ textAlign: "center" }}>* Rajd *</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{active ? "Aktywny" : "Nieaktywny"}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{running ? "Odpalony" : "Oczekujący"}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>
                {event.awardsAreSecret ? "Nagrody ukryte" : "Nagrody jawne"}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={2}>
              <img src={"/images/rallies/" + event.imgSrc} width={128} />
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
                <Typography>{`Czas publikacji: ${activationDate}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas rozpoczęcia: ${startDate}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas zakończenia: ${expiryDate}`}</Typography>
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
              justify="flex-start"
              alignItems="flex-start"
              xs={2}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleItemPopover}
                >
                  {"Nagrody"}
                </Button>
              </Grid>

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
                <List style={{ width: "20vw", padding: "0.5rem" }}>
                  {event.awardsLevels.map(awardLevel => {
                    return (
                      <React.Fragment key={awardLevel.level}>
                        <ListItem
                          style={{
                            borderTop: "1px solid grey",
                            borderBottom: "1px solid grey",
                            background: "rgb(228, 228, 228)"
                          }}
                        >
                          <ListItemText
                            primary={
                              "Nagroda za " + awardLevel.level + " " + "PD"
                            }
                            primaryTypographyProps={{
                              style: { fontWeight: "bolder" }
                            }}
                          />
                        </ListItem>

                        <List style={{ paddingLeft: "1rem" }}>
                          {Object.keys(awardLevel.awards).map(
                            awardLevelClass => {
               
                              const data = awardLevel.awards[awardLevelClass]
                              if(data.length){

                                return (
                                  <ListItem
                                    style={{
                                      background: classThemes[awardLevelClass]
                                    }}
                                    key={awardLevel+awardLevelClass}
                                  >
                                  <List style={{ paddingLeft: "1rem" }} dense>
                                      {data.map(item => {
                                        return(
                                          <ListItem
                                            key={item.itemModel._id}
                                          >
                                            <ListItemText
                                              primary={item.itemModel.name}
                                              secondary={"x" + item.quantity}
                                            />

                                          </ListItem>
  
                                        )
                                      })}
                                    </List>
                                  
                                  </ListItem>
                                )
                              }else{
                                return null
                              }
                            }
                          )}
                          {/* {Object.values(awardLevel.awards)
                            .reduce((a, b) => a.concat(b))
                            .map(item => {
                              console.log(item)
                              return (
                                <ListItem
                                  style={{
                                    background:
                                      classThemes[item.class]
                                  }}
                                  key={item._id}
                                >
                                  <ListItemText
                                    primary={item.itemModel.name}
                                    secondary={"x" + item.quantity}
                                  />
                                </ListItem>
                              );
                            })} */}
                        </List>
                      </React.Fragment>
                    );
                  })}
                </List>
              </Popover>
            </Grid>
            <Grid item container direction="column" xs={2} spacing={2}>
              <Grid item>
                <Button color="primary" onClick={e => editEvent(event._id)}>
                  Edytuj
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

export default EventRallyListItem;
