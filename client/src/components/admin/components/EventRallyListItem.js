import React from "react";
import styled, { keyframes } from "styled-components";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import classThemes from "../../../assets/themes/classThemes";

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
  animation: ${pulse} ${props => (props.active ? "5s ease-in-out infinite" : "none")};
  border: 2px solid rgb(158, 0, 0);
`;

const EventRallyListItem = ({
  event,
  active,
  activateNow,
  editEvent,
  deleteEvent,
  archiveEvent,
  isLast
}) => {
  const [itemPopover, setItemPopover] = React.useState(null);

  const handleItemPopover = event => {
    setItemPopover(event.currentTarget);
  };

  const handleClose = () => {
    setItemPopover(null);
  };

  return (
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
              <Typography>
                {event.awardsAreSecret ? "Nagrody ukryte" : "Nagrody jawne"}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={2}>
              <img
                src={require("../../../assets/icons/events/" + event.imgSrc)}
                width={128}
              />
            </Grid>
            <Grid item container direction="column" xs={4}>
              <Grid item>
                <Typography
                  variant="h5"
                  style={{ fontSize: "1.2rem", fontWeight: "bolder" }}
                >
                  {event.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas publikacji: ${
                  event.activationDate.split("T")[0]
                }, ${event.activationDate.split("T")[1]}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas rozpoczęcia: ${
                  event.startDate.split("T")[0]
                }, ${event.startDate.split("T")[1]}`}</Typography>
              </Grid>
              <Grid item>
                <Typography>{`Czas zakończenia: ${
                  event.expiryDate.split("T")[0]
                }, ${event.expiryDate.split("T")[1]}`}</Typography>
              </Grid>
              {!active && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={e => activateNow(event.id)}
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
              justify="space-around"
              alignItems="center"
              xs={4}
              spacing={1}
            >
              <Grid item>
                <Typography>Nagrody:</Typography>
              </Grid>
              {event.awardsLevels.map(awardLevel => {
                return (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleItemPopover}
                    >
                      {"Próg" + " " + awardLevel.level + " " + "PD"}
                    </Button>
                  </Grid>
                );
              })}

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
                        <ListItem style={{borderTop: '1px solid grey', borderBottom: '1px solid grey', background: 'rgb(228, 228, 228)'}}>
                          <ListItemText
                          
                            primary={
                              "Nagroda za " + awardLevel.level + " " + "PD"
                            }
                            primaryTypographyProps={{style: {fontWeight: 'bolder'}}}
                          />
                        </ListItem>

                        <List style={{ paddingLeft: "1rem" }}>
                          {Object.values(awardLevel.awards)
                            .reduce((a, b) => a.concat(b))
                            .map(item => {
                              return (
                                <ListItem
                                  style={{
                                    background:
                                      classThemes[item.itemModel.class]
                                  }}
                                  key={item.itemModel.id}
                                >
                                  <ListItemText
                                    primary={item.itemModel.name}
                                    secondary={"x" + item.quantity}
                                  />
                                </ListItem>
                              );
                            })}
                        </List>
                      </React.Fragment>
                    );
                  })}
                </List>
                

                {/* {event.awardsLevels && selectedLevel && Object.values(event.awardsLevels.find(
                      awardLevel => awardLevel.level === selectedLevel
                    ).awards).reduce((a, b) => a.concat(b))
                    .map(item => {
                      return (
                        <Grid
                          item
                          style={{
                            background: classThemes[item.itemModel.class]
                          }}
                          key={item.itemModel.id}
                        >
                          <ListItemText
                            primary={item.itemModel.name}
                            secondary={"x" + item.quantity}
                          />
                        </Grid>
                      );
                    })}  */}
              </Popover>
              
            </Grid>
            <Grid item container direction="column" xs={2} spacing={2}>
              <Grid item>
                <Button color="primary" onClick={e => editEvent(event.id)}>
                  Edytuj
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={e => archiveEvent(event.id)}>
                  Archiwizuj
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={e => deleteEvent(event.id)} color="secondary">
                  Usuń
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </StyledListItem>
      {!isLast && <Divider />}
    </React.Fragment>
  );
};

export default EventRallyListItem;
