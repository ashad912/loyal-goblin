import React from "react";
import styled from 'styled-components'
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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

import {getAdminParties, deleteParty} from '../../store/actions/partyActions'

const RefreshBar = styled.div`
  flex-grow: 3;
  text-align: left;
`


const AdminParties = () => {
    
    const [fetchedParties, setFetchedParties] = React.useState([])
    const [parties, setParties] = React.useState([]);
    const [nameFilter, setNameFilter] = React.useState("");

    const [deleteDialog, setDeleteDialog] = React.useState(false)
    const [partyToDelete, setPartyToDelete] = React.useState({_id: '', name: ''})

    React.useEffect(() => {
        fetchParties() 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        applyNameFilter()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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