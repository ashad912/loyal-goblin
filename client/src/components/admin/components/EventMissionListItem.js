import React from "react";
import styled, {keyframes}  from 'styled-components'
import Popover from "@material-ui/core/Popover";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
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
animation:${pulse} ${props => props.active ? '5s ease-in-out infinite' : 'none'};
`

const EventMissionListItem = ({
  event,
  active,
  activateNow,
  editEvent,
  deleteEvent,
  archiveEvent,
  isLast
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
  return (
    <React.Fragment>

    <StyledListItem active={active ? 1: 0}>
      <Grid container direction="column" spacing={2}>
        <Grid item container>
          <Grid item xs={2}>
            <Typography style={{ textAlign: "center" }}>
              - Misja -
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{active ? "Aktywna" : "Nieaktywna"}</Typography>
          </Grid>
          <Grid item xs={2}>
              <Typography>{event.awardsAreSecret ? "Nagrody ukryte" : "Nagrody jawne"}</Typography>
            </Grid>
          <Grid item xs={6}>
            <Box display="flex">
              <Typography style={{ marginRight: "1rem" }}>{`${
                event.minPlayers
              } - ${event.maxPlayers}`}</Typography>{" "}
              <PeopleIcon />
              <Typography  style={{ marginLeft: "1rem" }}>Poziom {event.minLevel} + | {`S: ${event.strength} / Z: ${event.dexterity} / M: ${event.magic} / W: ${event.endurance}`}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={2}>
            <img
              src={require("../../../assets/icons/events/" + event.imgSrc)}
              width={128}
            />
          </Grid>
          <Grid item container direction="column" xs={6}>
            <Grid item>
              <Typography variant="h5" style={{fontSize: '1.2rem', fontWeight: 'bolder'}}>{event.title}</Typography>
            </Grid>
            <Grid item>
              <Typography>{`Czas publikacji: ${
                event.activationDate.split("T")[0]
              }, ${event.activationDate.split("T")[1]}`}</Typography>
            </Grid>
            <Grid item>
              <Typography>{`Czas zakończenia: ${event.expiryDate.split("T")[0]}, ${
                event.expiryDate.split("T")[1]
              }`}</Typography>
            </Grid>
            {!active &&
            <Grid item>
              <Button variant="contained" color="primary" onClick={(e) => activateNow(event.id)}>
                Publikuj teraz
              </Button>
            </Grid>
            }
          </Grid>
          <Grid
            item
            container
            direction="column"
            justify="space-around"
            xs={2}
            spacing={2}
          >
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAmuletPopover}
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
                  style={{ width: "10vw", padding: "0.5rem" }}
                >
                  {event.amulets.map(amulet => {
                    return (
                      <Grid item key={amulet.itemModel.id}>
                        <ListItemText
                          primary={amulet.itemModel.name}
                          secondary={"x" + amulet.quantity}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Popover>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleItemPopover}
              >
                Nagrody
              </Button>
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
                  style={{ width: "10vw", padding: "0.5rem" }}
                >
                  {Object.values(event.items)
                    .reduce((a, b) => a.concat(b))
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
                    })}
                </Grid>
              </Popover>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={2} spacing={2}>
            <Grid item>
              <Button color="primary" onClick={e => editEvent(event.id)}>Edytuj</Button>
            </Grid>
            <Grid item>
              <Button onClick={e => archiveEvent(event.id)}>Archiwizuj</Button>
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

export default EventMissionListItem;
