import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Box from "@material-ui/core/Box";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import ItemsModalListItem from "./ItemsModalListItem";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormLabel from "@material-ui/core/FormLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

import itemCategories from "../../../assets/categories/items";
import characterClasses from "../../../assets/categories/characterClasses";

const ItemsModal = props => {

  const [searchValue, setSearchValue] = useState("");
  const [itemsList, setItemsList] = useState({});
  const [classFilter, setClassFilter] = useState("any");
    const [categoryFilter, setCategoryFilter] = useState({});
  const [perksFilter, setPerksFilter] = useState(false);
  
  useEffect(() => {

    setItemsList({...props.itemsList})
    const categories = {};
    Object.keys(props.itemsList).forEach(
      category => 
      (categories[category] = true)
    );
    setCategoryFilter(categories)
    
  }, [props.itemsList])

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      const tempItemsList = { ...itemsList };
      for (let category in tempItemsList) {
        tempItemsList[category] = tempItemsList[category].filter(item =>
          item.itemModel.name.search(searchValue) !== -1
        );
      }
      setItemsList(tempItemsList);
    } else {
      setItemsList(props.itemsList);
    }
  }, [searchValue]);

  useEffect(() => {
    if (classFilter !== "any") {
      const tempItemsList = { ...itemsList };
      for (let category in tempItemsList) {
        tempItemsList[category] = tempItemsList[category].filter(
          item => item.itemModel.class === classFilter
        );
      }
      setItemsList(tempItemsList);
    } else {
      setItemsList(props.itemsList);
    }
  }, [classFilter]);

  useEffect(() => {
    if (perksFilter) {
      const tempItemsList = { ...itemsList };
      for (let category in tempItemsList) {
        tempItemsList[category] = tempItemsList[category].filter(
          item =>
            item.itemModel.hasOwnProperty("perks") &&
            item.itemModel.perks.length > 0
        );
      }
      setItemsList(tempItemsList);
    } else {
      setItemsList(props.itemsList);
    }
  }, [perksFilter]);

  const handlePerksFilterChange = () => {
    setPerksFilter(prev => !prev);
  };

  const handleCategoryFilterChange = e => {
    setCategoryFilter(prev => {
      const filter = { ...prev };
      filter[e.target.value] = !prev[e.target.value];
      return filter;
    });
  };

  const handleClassFilterChange = e => {
    setClassFilter(e.target.value);
  };

  const handleSeachChange = e => {
    setSearchValue(e.target.value.trim());
  };



  const handleSubtract = (item, characterClass) => {
    props.handleSubtractItem(item, characterClass, props.currentAwardTier);
  };

  const handleChangeQuantity = (item, e, characterClass) => {
    props.handleChangeItemQuantity(item, e.target.value, characterClass, props.currentAwardTier);
  };

  const handleAdd = (item, characterClass) =>  {
    props.handleAddItem(item, characterClass, props.currentAwardTier);
  };

  const eventItems = props.isRally? (props.currentAwardTier > -1 && props.awardsLevels[props.currentAwardTier].awards) : props.eventItemsList

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>{props.isRally ? `Nagrody dla progu ${props.currentAwardTier+1 }` : "Dodaj przedmioty do misji"}</DialogTitle>
      <div style={{ display: "flex", overflow: "hidden", height: "70vh" }}>
        <div
          style={{
            borderRight: "1px solid grey",
            flexBasis: "60%",
            overflow: "auto"
          }}
        >
          <ExpansionPanel style={{ margin: "2rem" }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Filtry przedmiotów</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Box style={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="Szukaj nazwy przedmiotu"
                  type="search"
                  value={searchValue}
                  onChange={handleSeachChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <Grid container style={{ marginTop: "2rem" }}>
                  <Grid item xs={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="category-filter">
                        Kategorie:
                      </FormLabel>
                      <FormGroup>
                        {Object.keys(categoryFilter).map(category => {
                          return (
                            <FormControlLabel
                              key={category}
                              control={
                                <Checkbox
                                  checked={categoryFilter[category]}
                                  onChange={handleCategoryFilterChange}
                                  value={category}
                                />
                              }
                              label={itemCategories[category]}
                            />
                          );
                        })}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid
                    xs={6}
                    item
                    container
                    direction="column"
                    spacing={2}
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <FormControl
                        style={{
                          boxSizing: "border-box",
                          width: "10rem",
                          alignSelf: "flex-start"
                        }}
                      >
                        <InputLabel htmlFor="class-choice">Klasa</InputLabel>
                        <Select
                          value={classFilter}
                          onChange={handleClassFilterChange}
                          inputProps={{
                            name: "class",
                            id: "class-filter"
                          }}
                        >
                          <MenuItem value={"any"}>Każda</MenuItem>
                          <MenuItem value={"warrior"}>Wojownik</MenuItem>
                          <MenuItem value={"mage"}>Mag</MenuItem>
                          <MenuItem value={"rogue"}>Łotrzyk</MenuItem>
                          <MenuItem value={"cleric"}>Kleryk</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={perksFilter}
                            onChange={handlePerksFilterChange}
                          />
                        }
                        label="Przedmiot posiada efekty"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <List dense style={{ padding: "1rem" }}>
            {Object.keys(itemsList)
              .filter(
                category =>
                  itemsList[category].length > 0 && categoryFilter[category]
              )
              .map(itemCategory => {
                return (
                  <React.Fragment key={itemCategory}>
                    <Divider />
                    <Typography variant="caption">
                      {itemCategories[itemCategory]}
                    </Typography>
                    <List>
                      {itemsList[itemCategory].map(item => {
                        return (
                          <ItemsModalListItem
                            item={item}
                            key={item.itemModel.id}
                            handleAdd={handleAdd}
                          />
                        );
                      })}
                    </List>
                  </React.Fragment>
                );
              })}
          </List>
        </div>
        <div style={{ flexBasis: "40%", overflow: "auto" }}>
          <List dense style={{ padding: "1rem" }}>
            {Object.keys(eventItems).map(characterClass => {
              return (
                eventItems[characterClass].length > 0 && (
                  <React.Fragment key={characterClass}>
                    <Typography style={{ fontWeight: "bolder" }}>
                      {characterClasses[characterClass]}
                    </Typography>
                    <List>
                      {eventItems[characterClass].map(item => {
                        return (
                          <ListItem key={item.itemModel.id}>
                            <Grid
                              container
                              direction="row"
                              justify="space-around"
                              alignItems="center"
                              wrap="nowrap"
                              spacing={2}
                            >
                              <Grid item style={{ flexBasis: "40%" }}>
                                <Typography >
                                  {item.itemModel.name}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={e => handleSubtract(item, characterClass)}
                                >
                                  -
                                </Button>
                              </Grid>
                              <Grid item>
                                <Input
                                  style={{ width: "3rem" }}
                                  type="tel"
                                  value={item.quantity}
                                  onChange={
                                    e => handleChangeQuantity(item, e, characterClass)
                                  }
                                  inputProps={{
                                    style: { textAlign: "center" }
                                  }}
                                />
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={e => handleAdd(item, characterClass)}
                                >
                                  +
                                </Button>
                              </Grid>
                            </Grid>
                          </ListItem>
                        );
                      })}
                    </List>
                  </React.Fragment>
                )
              );
            })}
          </List>
        </div>
      </div>

      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemsModal;
