import React from "react";
import moment from 'moment'
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import { useTheme } from '@material-ui/core/styles';
import uuid from 'uuid/v1'
import Toolbar from "@material-ui/core/Toolbar";
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";

import PartyList from "../components/PartyList";
import {designateUserLevel} from '../utils/methods'
import {userFilterStatuses} from '../../../utils/labels'
import {getAdminUsers, toggleUserActiveStatus} from '../../../store/adminActions/userActions'

const mockUsers = [
  { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
  { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
  { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
  { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Ghi", experience: 400, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Janusz Korwin Mikke", experience: 1000, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
  { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
  { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() }
];
const statusCodes = {
  active: "Aktywny",
  new: "Nowy",
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
  const [users, setUsers] = React.useState([]);
  const [fetchedUsers, setFetchedUsers] = React.useState([])
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [nameFilter, setNameFilter] = React.useState("");
  const [page, setPage] = React.useState(0)
  const [partys, setPartys] = React.useState(mockPartys);

  const fetchUsers = async () => {
    const users = await getAdminUsers()
    setFetchedUsers(users)
    applyStatusFilter(statusFilter, users)
  }

  React.useEffect(() => {
    fetchUsers()

    
  
  }, [])

  React.useEffect(() => {

    let timer

    clearInterval(timer)

    timer = setInterval(() => {
      fetchUsers()     
    }, 60 * 1000);

    return () => clearInterval(timer);

  }, [statusFilter])

  const applyStatusFilter = (status, users) => {
    let tempUsers = users ? [...users] : [...fetchedUsers];
    switch (status) {
      case "all":
        //tempUsers = [...fetchedUsers];
        break;
      case "new":
        tempUsers = tempUsers.filter(user => !user.hasOwnProperty('name') || !user.name.length);
        break;
      case "active":
        tempUsers = tempUsers.filter(user => user.active).sort((a, b)=> (moment(a.lastActivityDate).valueOf() > moment(b.experience).valueOf()) ? 1 : -1);
        break;
      case "banned":
        tempUsers = tempUsers.filter(user => !user.active);
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
        user => user.hasOwnProperty('name') && user.name.search(nameFilter) !== -1
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

  const handleToggleBan = async (user) => {
    await toggleUserActiveStatus(user)
    fetchUsers()
  }

  const designateActivityTime = (lastActivityDate) => {
    return moment(lastActivityDate).fromNow();
  }


  const handlePreviousPageButtonClick = () => {
    setPage(page-1)
  }

  const handleNextPageButtonClick = () => {
    setPage(page+1)
  }
  
  const tenOrNo = page === parseInt(users.length / 10) ? (users.length % 10) : 10
  const oneOrZero = users.length ? 1 : 0

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
                {Object.keys(userFilterStatuses).map((statusKey) => {
                    return(
                        <MenuItem value={statusKey}>{userFilterStatuses[statusKey]}</MenuItem>
                    )
                })}

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
        <Toolbar style={{justifyContent: 'flex-end', 'padding': 0, 'min-height': '1rem'}}>
          <Typography> {`${(page*10)+oneOrZero}-${(page*10)+tenOrNo} z ${users.length}`}</Typography>
          <div style={{marginLeft: '1rem'}}>
            <IconButton
              onClick={handlePreviousPageButtonClick}
              disabled={page === 0}
              aria-label="first page"
              style={{padding: '0.5rem'}}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              onClick={handleNextPageButtonClick}
              disabled={page === parseInt(users.length / 10)}
              aria-label="first page"
              style={{padding: '0.5rem'}}
            >
              <KeyboardArrowRight />
            </IconButton>
            
          </div>
        </Toolbar>
        <List style={{ border: "1px solid grey" }} alignItems="flex-start">
          {users.slice(page*10, page*10 + 10).map(user => {
            return (
              
              <ListItem key={user.id} style={{paddingTop: '0.1rem', paddingBottom: '0.1rem'}}>
                <Grid item xs={3}>
                  <Typography>{user.name}</Typography>
                </Grid>
                <Grid item xs={2} style={{textAlign: 'center'}}>
                  <Typography variant="caption">{'Poziom ' + designateUserLevel(user.experience)}</Typography>
                </Grid>
                <Grid item xs={2} style={{textAlign: 'center'}}>
                  <Typography variant="caption">{user.experience}</Typography>
                </Grid>
                <Grid item xs={3} style={{textAlign: 'center'}}>
                  <Typography variant="caption">
                    {user.active ? ('Aktywny ' + designateActivityTime(user.lastActivityDate)) : ((!user.hasOwnProperty('name') || !user.name.length) ? ('Nowy') : ('Zbanowany'))}
                  </Typography>
                </Grid>
                <Grid item xs={2} style={{textAlign: 'right'}}>
                  <Button color="secondary" onClick={() => handleToggleBan(user)}>{user.active ? ('Zbanuj') : ('Odbanuj')}</Button>
                </Grid>
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
