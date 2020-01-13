import React from "react";
import moment from 'moment'
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

import uuid from 'uuid/v1'

import Paper from '@material-ui/core/Paper';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import PartyList from "../parties/PartyList";

import styled from 'styled-components'
import {getAdminParties, deleteParty} from '../../../store/adminActions/partyActions'

const RefreshBar = styled.div`
  flex-grow: 3;
  text-align: left;
`


const mockParties = [
    {
      name: "Drużyna A",
      leader:  { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
      members: [
        { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
        { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
      ]
    },
    {
      name: "Ekipa jamnika",
      leader: { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
      members: [
        { name: "Nnnn", experience: 500, active: true, _id: uuid(), lastActivityDate: moment()},
        { name: "Oppppp pp", experience: 600, active: true, _id: uuid(), lastActivityDate: moment() },
        { name: "Rrr rr", experience: 700, active: true, _id: uuid(), lastActivityDate: moment() },
        { name: "Stuwxyz", experience: 800, active: true, _id: uuid(), lastActivityDate: moment() },
        { name: "A B", experience: 100, active: true, _id: uuid(), lastActivityDate: moment() },
        { name: "Ccc", experience: 200, active: true, _id: uuid(), lastActivityDate: moment() },
        { name: "Dee f", experience: 300, active: true, _id: uuid(), lastActivityDate: moment() },
        
      ]
    }
  ];

const AdminParties = () => {
    
    const [fetchedParties, setFetchedParties] = React.useState([])
    const [parties, setParties] = React.useState([]);
    const [nameFilter, setNameFilter] = React.useState("");

    const [deleteDialog, setDeleteDialog] = React.useState(false)
    const [partyToDelete, setPartyToDelete] = React.useState({_id: '', name: ''})

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

    const handleDeleteDialogOpen = (_id, name) => {
     
      setPartyToDelete({_id, name})
      setDeleteDialog(true)
    }
  
    const handleDeleteDialogClose = () => {
    
      setDeleteDialog(false)
      setPartyToDelete({_id: '', name: ''})
    }

    const handlePartyDelete = async  () => {
      await deleteParty(partyToDelete._id)
      fetchParties()
      handleDeleteDialogClose()
    }

    const handleRefresh = () => {
      fetchParties() 
    }

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
          <RefreshBar>
            <IconButton
                onClick={handleRefresh}
                aria-label="Odśwież"
                style={{padding: '0.5rem'}}
            >
              <RefreshIcon/>
            </IconButton>
          </RefreshBar>
            {parties.length ? (<PartyList parties={parties} handleDelete={handleDeleteDialogOpen}/>) : (<Typography>Brak utworzonych drużyn!</Typography>)}
          </Grid>
          <Dialog
            open={deleteDialog}
            onClose={handleDeleteDialogClose}
          >
            <DialogTitle >Usuwanie przedmiotu</DialogTitle>
            <DialogContent>
              <DialogContentText >
                      <span>Czy na pewno chcesz usunąć drużynę {partyToDelete.name}?</span>< br/>
                      Aktywna sesja sklepu bądź misji drużyny zostanie zakończona.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="secondary">
                Anuluj
              </Button>
              <Button onClick={handlePartyDelete} color="primary" autoFocus>
                Potwierdź
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
    )
}

export default AdminParties