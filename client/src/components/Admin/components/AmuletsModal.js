import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";




const AmuletsModal = props => {
  const handleAdd = id => () => {
    props.handleAddAmulet(id);
  };

  const handleSubtract = id => () => {
    props.handleSubtractAmulet(id);
  };

  const handleDelete = id => () => {
    props.handleDeleteAmulet(id);
  };

  const handleChangeQuantity = (e, id) => {
    props.handleChangeAmuletQuantity(e, id);
  };

  const handleCheckbox = (id, quantity) => () => {
    if (quantity > 0) {
        props.handleDeleteAmulet(id);
    } else {
        props.handleAddAmulet(id);
    }
  };
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Dodaj amulety misji</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={4} style={{ borderRight: "1px solid grey" }}>
              <List dense>
                {props.amuletList.map(amulet => {
                  return (
                    <ListItem key={amulet.itemModel.id}>
                      <ListItemAvatar>
                        <img
                          src={require("../../../assets/icons/items/" +
                            amulet.itemModel.imgSrc)}
                          width="64px"
                        />
                      </ListItemAvatar>
                      <ListItemText primary={amulet.itemModel.name} />

                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          onChange={handleCheckbox(
                            amulet.itemModel.id,
                            amulet.quantity
                          )}
                          checked={amulet.quantity > 0}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
            <Grid item xs={8}>
              <List dense>
                {props.eventAmuletsList
                  .filter(amulet => amulet.quantity > 0)
                  .map(amulet => {
                    return (
                      <ListItem key={amulet.itemModel.id}>
                        <Grid
                          item
                          container
                          direction="row"
                          justify="space-between"
                          alignItems="center"
                          spacing={2}
                        >
                          <Grid item >
                            <ListItemAvatar>
                              <img
                                src={require("../../../assets/icons/items/" +
                                  amulet.itemModel.imgSrc)}
                                width="64px"
                              />
                            </ListItemAvatar>
                          </Grid>
                          <Grid item style={{flexBasis: '40%'}}>
                            <Typography variant="h6">
                              {amulet.itemModel.name}
                            </Typography>
                          </Grid>
                          <Grid item >
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleSubtract(amulet.itemModel.id)}
                            >
                              -
                            </Button>
                          </Grid>
                          <Grid item>
                            <Input
                            style={{width: '3rem'}}
                              type="tel"
                              value={amulet.quantity}
                              onChange={e =>
                                handleChangeQuantity(e, amulet.itemModel.id)
                              }
                              inputProps = {{style: {textAlign: 'center'}}}
                            />
                          </Grid>
                          <Grid item >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleAdd(amulet.itemModel.id)}
                            >
                              +
                            </Button>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AmuletsModal;
