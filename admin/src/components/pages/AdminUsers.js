import React from "react";
import moment from 'moment'
import styled from 'styled-components'
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from '@material-ui/icons/Refresh';

import UserListItem from '../common/UserListItem'
import PaginationBar from "../common/PaginationBar";

import {userFilterStatuses} from '../../utils/labels'
import {getAdminUsers, toggleUserActiveStatus} from '../../store/actions/userActions'


const RefreshBar = styled.div`
  flex-grow: 3;
  text-align: left;
`

const AdminUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [fetchedUsers, setFetchedUsers] = React.useState([])
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [nameFilter, setNameFilter] = React.useState("");
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [autoRefresh, setAutoRefresh] = React.useState(false)

  React.useEffect(() => {
    fetchUsers() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {

    let timer
    clearInterval(timer)
    if(autoRefresh){
      timer = setInterval(() => {
        fetchUsers()     
      }, 60 * 1000);
    } 
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedUsers, statusFilter, autoRefresh])


  React.useEffect(() => {
    applyNameFilter()
    if(nameFilter.trim().length > 0){
      setPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFilter]);

  const fetchUsers = async () => {
    const users = await getAdminUsers()
    setFetchedUsers(users)
    applyNameFilter(users)
  }

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

  const applyNameFilter = (users) => {
    let tempUsersList = applyStatusFilter(statusFilter, users);
    if (nameFilter.trim().length > 0) {
      tempUsersList = tempUsersList.filter( (user) => {
        const reg = new RegExp(nameFilter, 'gi')
        return user.hasOwnProperty('name') && user.name.match(reg)
       } );
      
      setUsers(tempUsersList);
    } else {
      setUsers(tempUsersList);
    }
  }





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

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  const handleRefresh = () => {
    fetchUsers() 
  }

  const handleSetRowsPerPage = (e) => {
    setRowsPerPage(e.target.value)
    setPage(0)
  }

  const handlePreviousPageButtonClick = () => {
    setPage(page-1)
  }

  const handleNextPageButtonClick = () => {
    setPage(page+1)
  }
  

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item style={{ width: "90%" }}>
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
                        <MenuItem key={statusKey} value={statusKey}>{userFilterStatuses[statusKey]}</MenuItem>
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
        <Toolbar style={{justifyContent: 'flex-end', 'padding': 0, minHeight: '1rem'}}>
          <RefreshBar>
            <FormControlLabel
                style={{marginLeft: '0rem'}}
                control={
                  <Checkbox
                    checked={autoRefresh}
                    onChange={handleToggleAutoRefresh}
                  />
                }
                label="Autoodświeżanie (1 min)"
            />
            <IconButton
                onClick={handleRefresh}
                aria-label="Odśwież"
                style={{padding: '0.5rem'}}
            >
              <RefreshIcon/>
            </IconButton>
          </RefreshBar>
          <PaginationBar
            records={users}
            rowsPerPage={rowsPerPage}
            page={page}
            backendCountedRecords={null}
            handleSetRowsPerPage={handleSetRowsPerPage}
            handlePreviousPageButtonClick={handlePreviousPageButtonClick}
            handleNextPageButtonClick={handleNextPageButtonClick}
          />
        </Toolbar>
        {users.length ? (<List style={{ border: "1px solid grey", alignItems: 'flex-start' }} >
          {users.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage).map(user => {
            return ( <UserListItem key={user._id} user={user} handleToggleBan={handleToggleBan}/>);
          })}
        </List>) : (
          <Typography>Brak użytkowników!</Typography>
        )}
        
      </Grid>
      
    </Grid>
  );
};

export default AdminUsers;
