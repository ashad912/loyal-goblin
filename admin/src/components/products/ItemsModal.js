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
import ItemsModalListItem from "../common/ItemsModalListItem";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

import {itemTypeLabelsPlural} from '../../utils/labels'

const ItemsModal = props => {
  const [searchValue, setSearchValue] = useState("");
  const [itemsList, setItemsList] = useState(props.itemsList);
  const [categoryFilter, setCategoryFilter] = useState({});
  const [perksFilter, setPerksFilter] = useState(false);

  useEffect(()=> {
    const categories = {}
    Object.keys(itemTypeLabelsPlural).forEach(categoryKey => {
      if(categoryKey !== 'all'){
        if(props.productCategory === 'beers'){
          if(categoryKey === 'torpedo'){
            categories[categoryKey] = true
          }else{
            categories[categoryKey] = false
          }
        }else{
          if(categoryKey === 'amulet'){
            categories[categoryKey] = true
          }else{
            categories[categoryKey] = false
          }
        }
        
      }
      
    });

    setCategoryFilter(categories)
  }, [props.productCategory])
  
  
  useEffect(()=> {
    setItemsList(props.itemsList)
  }, [props.itemsList])


  useEffect(() => {
      if (searchValue.trim().length > 0) {
        let tempItemsList = [ ...itemsList ];
        
        tempItemsList = tempItemsList.filter(itemModel =>
          itemModel.name.search(searchValue) !== -1
        )
        
        setItemsList(tempItemsList);
      } else {
        setItemsList(itemsList);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
    


  useEffect(() => {
    if (perksFilter) {
      let tempItemsList = [ ...itemsList ];
      
      tempItemsList = tempItemsList.filter(
        itemModel =>
          itemModel.hasOwnProperty("perks") &&
          itemModel.perks.length > 0
      );
      
      setItemsList(tempItemsList);
    } else {
      setItemsList(itemsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSeachChange = e => {
    setSearchValue(e.target.value.trim());
  };

  const handleSubtract = (item) => {
    props.handleSubtractItem(item);
  };

  const handleChangeQuantity = (item, e) => {
    props.handleChangeItemQuantity(item, e.target.value);
  };

  const handleAdd = (item) =>  {
    props.handleAddItem(item);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>{props.title}</DialogTitle>
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
                              label={itemTypeLabelsPlural[category]}
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
            {Object.keys(itemTypeLabelsPlural)
              .map(itemCategory => {
                console.log(itemsList)
                const categoryItems = itemsList.filter((item) => { 
                  console.log(item.type, itemCategory)
                  return item.type === itemCategory})
                console.log(categoryItems)
                return categoryItems.length > 0 && categoryFilter[itemCategory] && (
                  <React.Fragment key={itemCategory}>
                    <Divider />
                    <Typography variant="caption">
                      {itemTypeLabelsPlural[itemCategory]}
                    </Typography>
                    <List>
                      {categoryItems.map(itemModel => {
                        return (
                          <ItemsModalListItem
                            item={itemModel}
                            key={itemModel._id}
                            handleAdd={handleAdd}
                            onlyAllClassItems={true}
                          />
                        );
                      })}
                    </List>
                  </React.Fragment>
                );}
              )}
          </List>
        </div>
        <div style={{ flexBasis: "40%", overflow: "auto" }}>
          <List dense style={{ padding: "1rem" }}>
            {props.productAwards.length > 0 && props.productAwards.map(award => {
              return (
                  <React.Fragment key={award}>
                    
                    <List>
                      
                       
                          <ListItem key={award.itemModel._id}>
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
                                  {award.itemModel.name}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={e => handleSubtract(award.itemModel)}
                                >
                                  -
                                </Button>
                              </Grid>
                              <Grid item>
                                <Input
                                  style={{ width: "3rem" }}
                                  type="tel"
                                  value={award.quantity}
                                  onChange={
                                    e => handleChangeQuantity(award.itemModel, e)
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
                                  onClick={e => handleAdd(award.itemModel)}
                                >
                                  +
                                </Button>
                              </Grid>
                            </Grid>
                          </ListItem>
                        
                     
                    </List>
                  </React.Fragment>
                )
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
