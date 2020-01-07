import React from "react";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";

import classThemes from "../../../assets/themes/classThemes";
import ItemsModalListItemPerks from "../components/ItemsModalListItemPerks";

const ItemsModalListItem = props => {
  const [chosenClass, setChosenClass] = React.useState("any");

  const itemModel = props.item;

  const handleSelectChange = e => {
    setChosenClass(e.target.value);
  };

  const handleAdd = () => {
    props.handleAdd(
      itemModel,
      itemModel.class !== "any" ? itemModel.class : chosenClass
    );
  };

  return (
    <ListItem
      style={{
        background:
          itemModel.class !== "any"
            ? `${classThemes[itemModel.class]}`
            : "none"
      }}
    >
      <Grid container direction="column" style={{ maxWidth: "70%" }}>
        <Grid item container>
          <Grid item>
          <ListItemAvatar>
            <img
              style={{ width: "32px", height: "32px" }}
              src={`/images/items/${itemModel.imgSrc}`}
            />
          </ListItemAvatar>
          </Grid>
          <Grid item>

          <ListItemText
            primary={itemModel.name}
            secondary={
              <span style={{ fontStyle: "italic" }}>
                {itemModel.description}
              </span>
            }
          />
          </Grid>
        </Grid>
        {itemModel.hasOwnProperty("perks") &&
          itemModel.perks.length > 0 && (
            <Grid item style={{ border: "1px solid grey" }}>
              <Divider />
              <List dense>
                {itemModel.perks.map(perk => {
                  //TODO: ustalić dokładnie co pobierane jest z perków
                  return (
                    <ItemsModalListItemPerks
                    
                      perk={perk}
                      key={perk.perkType + perk.value + perk.target}
                    />
                  );
                })}
              </List>
            </Grid>
          )}
      </Grid>

      {!props.onlyAllClassItems && itemModel.class === "any" ? (
        <FormControl
          style={{ margin: "0 1rem", boxSizing: "border-box", width: "10rem", alignSelf: 'flex-start' }}
        >
          <InputLabel htmlFor="class-choice">Klasa</InputLabel>
          <Select
            value={chosenClass}
            onChange={handleSelectChange}
            inputProps={{
              name: "class",
              id: "class-choice"
            }}
          >
            <MenuItem value={"any"}>Każda</MenuItem>
            <MenuItem value={"warrior"}>Wojownik</MenuItem>
            <MenuItem value={"mage"}>Mag</MenuItem>
            <MenuItem value={"rogue"}>Łotrzyk</MenuItem>
            <MenuItem value={"cleric"}>Kleryk</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <div style={{ width: "10rem" }} />
      )}
      <Button variant="contained" onClick={handleAdd} style={{alignSelf: 'flex-start', marginTop: '0.8rem'}}>
        Dodaj
      </Button>
    </ListItem>
  );
};

export default ItemsModalListItem;
