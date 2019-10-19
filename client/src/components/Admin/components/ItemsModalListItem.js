import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import classThemes from "../../../assets/themes/classThemes";

const ItemsModalListItem = props => {
  const [chosenClass, setChosenClass] = React.useState("any");

  const item = props.item;

  const handleSelectChange = e => {
    setChosenClass(e.target.value);
  };

  const handleAdd = () => {
      props.handleAdd(item, item.itemModel.class !== 'any' ? item.itemModel.class : chosenClass)
  }

  return (
    <ListItem
      style={{
        background:
          item.itemModel.class !== "any"
            ? `${classThemes[item.itemModel.class]}`
            : "none"
      }}
    >
      <ListItemAvatar>
        <img
          style={{ width: "32px", height: "32px" }}
          src={require(`../../../assets/icons/items/${item.itemModel.imgSrc}`)}
        />
      </ListItemAvatar>
      <ListItemText
        style={{ flexBasis: "40%" }}
        primary={item.itemModel.name}
        secondary={<span>{item.itemModel.fluff}</span>}
      />
      {item.itemModel.class === "any" && (
        <FormControl style={{ margin: "0 1rem" }}>
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
      )}
      <Button variant="contained" onClick={handleAdd}>Dodaj</Button>
    </ListItem>
  );
};

export default ItemsModalListItem;
