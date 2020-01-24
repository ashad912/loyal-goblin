import React from "react";
import styled from 'styled-components'
import moment from 'moment'
import MomentUtils from '@date-io/moment';
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import EventIcon from '@material-ui/icons/Event';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import PaginationBar from "../common/PaginationBar";
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import OrderListItem from '../orders/OrderListItem'

import {getAdminOrders} from '../../store/actions/productActions'

moment.locale('pl')

const RefreshBar = styled.div`
  flex-grow: 3;
  text-align: left;
`

function useDidUpdateEffect(fn, inputs) {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current){
      fn();
    }else{
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}

const AdminOrders = () => {
  const [orders, setOrders] = React.useState([]);
  const [countedRecords, setCountedRecords] = React.useState(0)
  const [fromDate, setFromDate] = React.useState(moment().subtract(7, "days").format("YYYY-MM-DDTHH:mm"))
  const [toDate, setToDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm"))
  const [nameFilter, setNameFilter] = React.useState("");
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  
  React.useEffect(() => {
    fetchOrders() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage])


  useDidUpdateEffect(() => {
    let timer

    clearTimeout(timer)
    timer = setTimeout(() => {
      updateRecords()
    }, 500)

    return () => clearInterval(timer);
  }, [nameFilter]);

  useDidUpdateEffect(() => { 
    updateRecords()
  }, [fromDate, toDate]);


  const fetchOrders = async () => {
    const data = await getAdminOrders(page, rowsPerPage, fromDate, toDate, nameFilter)
    const {orders, countedRecords} = data
    setCountedRecords(countedRecords)
    setOrders(orders)
  }

  const updateRecords = () =>{
    fetchOrders()
    if(nameFilter.trim().length > 0){
      setPage(0)
    } 
  }


  const handleFromDateChange = (input) => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    setFromDate(date)
  }

  

  const handleToDateChange = (input) => {
    const date = input.format("YYYY-MM-DDTHH:mm")
    setToDate(date)
  }

  const handleChangeNameFilter = (e) => {
    setNameFilter(e.target.value.trim());
  };


  const handleRefresh = () => {
    setToDate(moment().format("YYYY-MM-DDTHH:mm"))
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

  // const rowsPerPageOrNo = page === parseInt(orders.length / rowsPerPage) ? (orders.length % rowsPerPage) : rowsPerPage
  // const oneOrZero = orders.length ? 1 : 0

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
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker
                style={{marginRight: '1rem'}}
                cancelLabel={'Anuluj'}
                ampm={false}
                //allowKeyboardControl={false}
                label="Data od"
                value={fromDate}
                onChange={handleFromDateChange}
                //invalidDateMessage={'Niepoprawny format!'}
                disableFuture
                format="YYYY-MM-DD HH:mm"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <EventIcon/>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <DateTimePicker
                style={{marginRight: '1rem'}}
                cancelLabel={'Anuluj'}
                ampm={false}
                label="Data do"
                value={toDate}
                onChange={handleToDateChange}
                disableFuture
                format="YYYY-MM-DD HH:mm"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <EventIcon/>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MuiPickersUtilsProvider>
           
            <TextField
              value={nameFilter}
              onChange={handleChangeNameFilter}
              margin="dense"
              label="Szukaj zamówienia"
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
          <RefreshBar>
            <IconButton
                onClick={handleRefresh}
                aria-label="Odśwież"
                style={{padding: '0.5rem'}}
            >
              <RefreshIcon/>
            </IconButton>
          </RefreshBar>
          <PaginationBar
            records={orders}
            rowsPerPage={rowsPerPage}
            page={page}
            backendCountedRecords={countedRecords}
            handleSetRowsPerPage={handleSetRowsPerPage}
            handlePreviousPageButtonClick={handlePreviousPageButtonClick}
            handleNextPageButtonClick={handleNextPageButtonClick}
          />
        </Toolbar>
        {orders.length > 0 ? (
          <List style={{ border: "1px solid grey" }} alignItems="flex-start">
            {orders.map(order => {
              return ( <OrderListItem order={order} />);
            })}
          </List>
        ) : (<Typography>Brak zamówień!</Typography>)}
      </Grid>
    </Grid>
  );
};

export default AdminOrders;
