import React from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";

import PartyList from "../components/PartyList";

const mockUsers = [
  { name: "A B", level: 1, status: "away", id: 1 },
  { name: "Ccc", level: 2, status: "active", id: 2 },
  { name: "Dee f", level: 3, status: "away", id: 3 },
  { name: "Ghi", level: 4, status: "active", id: 4 },
  { name: "Janusz Korwin Mikke", level: 100, status: "active", id: 5 },
  { name: "Nnnn", level: 5, status: "away", id: 6 },
  { name: "Oppppp pp", level: 6, status: "banned", id: 7 },
  { name: "Rrr rr", level: 7, status: "away", id: 8 },
  { name: "Stuwxyz", level: 8, status: "banned", id: 9 }
];
const statusCodes = {
  active: "Aktywny",
  away: "Poza Goblinem",
  banned: "Zbanowany"
};

const mockPartys = [
  {
    name: "Drużyna A",
    leader: { _id: "1", name: "Szef", avatar: "moose.png" },
    members: [
      { _id: "2", name: "Przydupas 1", avatar: "moose.png" },
      { _id: "3", name: "Przydupas 2", avatar: "moose.png" }
    ]
  },
  {
    name: "Ekipa jamnika",
    leader: { _id: "4", name: "Jamnik", avatar: "moose.png" },
    members: [
      { _id: "5", name: "Przydupas 1", avatar: "moose.png" },
      { _id: "6", name: "Przydupas 2", avatar: "moose.png" }
    ]
  }
];

const AdminUsers = () => {
  const [users, setUsers] = React.useState(mockUsers);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [nameFilter, setNameFilter] = React.useState("");
  const [partys, setPartys] = React.useState(mockPartys);

  const applyStatusFilter = status => {
    let tempUsers = [...mockUsers];
    switch (status) {
      case "all":
        tempUsers = [...mockUsers];
        break;
      case "active":
        tempUsers = tempUsers.filter(user => user.status === "active");
        break;
      case "away":
        tempUsers = tempUsers.filter(user => user.status === "away");
        break;
      case "banned":
        tempUsers = tempUsers.filter(user => user.status === "banned");
        break;

      default:
        break;
    }

    setUsers(tempUsers);
    return tempUsers;
  };

  React.useEffect(() => {
    let tempUsersList = applyStatusFilter(statusFilter);
    if (nameFilter.trim().length > 0) {
      tempUsersList = tempUsersList.filter(
        user => user.name.search(nameFilter) !== -1
      );
      setUsers(tempUsersList);
    } else {
      setUsers(tempUsersList);
    }
  }, [nameFilter]);

  const handleChangeNameFilter = e => {
    setNameFilter(e.target.value.trim());
  };

  const handleChangeStatusFilter = e => {
    const status = e.target.value;
    setStatusFilter(status);
    applyStatusFilter(status);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item style={{ width: "80%" }}>
        <Paper
          style={{
            width: "100%",
            margin: "1rem auto",
            padding: "1rem",
            boxSizing: "border-box"
          }}
        >
          <Typography>Filtruj</Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <FormControl style={{ alignSelf: "flex-start" }}>
              <InputLabel htmlFor="status-filter">Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleChangeStatusFilter}
                inputProps={{
                  id: "status-filter"
                }}
              >
                <MenuItem value={"all"}>Wszyscy</MenuItem>
                <MenuItem value={"active"}>Aktywni</MenuItem>
                <MenuItem value={"away"}>Poza Goblinem</MenuItem>
                <MenuItem value={"banned"}>Zbanowani</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={nameFilter}
              onChange={handleChangeNameFilter}
              margin="dense"
              label="Szukaj nazwy użytkownika"
              type="search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
        <List style={{ border: "1px solid grey" }} alignItems="flex-start">
          {users.map(user => {
            return (
              <ListItem key={user.id}>
                <ListItemText
                  style={{ maxWidth: "40%" }}
                  primary={user.name}
                  secondary={"Poziom " + user.level}
                />
                <ListItemAvatar>
                  <Typography variant="caption">
                    10000 PD
                  </Typography>
                </ListItemAvatar>
                <ListItemAvatar style={{marginLeft: '8rem'}}>
                  <Typography variant="caption">
                    {statusCodes[user.status]}
                  </Typography>
                </ListItemAvatar>
                
                <ListItemSecondaryAction>
                  <Button color="secondary">Zbanuj</Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item style={{ width: "40%" }}>
        <Typography variant="h5" style={{margin: "2rem 0 1rem 0"}}>Drużyny: </Typography>
        <PartyList partys={partys} />
      </Grid>
    </Grid>
  );
};

export default AdminUsers;
