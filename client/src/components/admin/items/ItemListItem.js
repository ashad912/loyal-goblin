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

const ItemListItem = ({
    key,
    index,
    item,
    editItem,
    deleteItem,
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

    <StyledListItem active={false}>
      <Grid container direction="column" spacing={2}>
        <Grid item container>
          <Grid item xs={3}>
            <Typography style={{ textAlign: "center" }}>
              
            </Typography>
          </Grid>
          <Grid item xs={3}>
            
          </Grid>
          <Grid item xs={6}>
            <Box display="flex">
              
            </Box>
          </Grid>
        </Grid>
        <Grid item container>
          <Grid item xs={2}>
            <img
              src={(item.imgSrc.includes('blob') || item.imgSrc.includes('data:image')) ? (item.imgSrc) : (require("../../../assets/icons/items/" + item.imgSrc))}
              width={32}
            />
          </Grid>
          <Grid item container direction="column" xs={6}>
            <Grid item>
              <Typography variant="h5" style={{fontSize: '1.2rem', fontWeight: 'bolder'}}>{item.name}</Typography>
            </Grid>
            <Grid item>
              
            </Grid>
            <Grid item>
              
            </Grid>
            
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
                  {item.perks.map((perk, index) => {
                    return (
                      <Grid item key={index}>
                        <ListItemText
                          primary={perk.perkType}
                          secondary={perk.value}
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
                  {/* {Object.values(event.items)
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
                    })} */}
                </Grid>
              </Popover>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={2} spacing={2}>
            <Grid item>
              <Button color="primary" onClick={e => editItem(item._id)}>Edytuj</Button>
            </Grid>
            <Grid item>
              
            </Grid>
            <Grid item>
              <Button onClick={e => deleteItem(item._id)} color="secondary">
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

export default ItemListItem;
