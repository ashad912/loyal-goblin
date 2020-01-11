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
import Avatar from '@material-ui/core/Avatar';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from '@material-ui/icons/Refresh';

import PartyList from "../components/PartyList";
import styled from 'styled-components'
import {getAdminParties} from '../../../store/adminActions/partyActions'


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

const AdminParties = () => {
    
    const [fetchedParties, setFetchedParties] = React.useState([])
    const [parties, setParties] = React.useState(mockPartys);
    const [nameFilter, setNameFilter] = React.useState("");

    React.useEffect(() => {
        fetchParties() 
    }, [])

    React.useEffect(() => {
        applyNameFilter()
    }, [nameFilter]);

    const fetchParties = async () => {
        const parties = await getAdminParties()
        setFetchedParties(parties)
        applyNameFilter(parties)
    }

    const applyNameFilter = (parties) => {
        let tempPartiesList = parties ? [...parties] : [...fetchedParties]
        if (nameFilter.trim().length > 0) {
          tempPartiesList = tempPartiesList.filter( (party) => {
            const reg = new RegExp(nameFilter, 'gi')
            return party.hasOwnProperty('name') && party.name.match(reg)
           } );
          
          setParties(tempPartiesList);
        } else {
          setParties(tempPartiesList);
        }
    }
      
    


    const handleChangeNameFilter = e => {
        setNameFilter(e.target.value.trim());
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
            <TextField
              value={nameFilter}
              onChange={handleChangeNameFilter}
              margin="dense"
              label="Szukaj nazwy drużyny"
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
                <PartyList partys={parties} />
            </Grid>
        </Grid>
    )
}

export default AdminParties