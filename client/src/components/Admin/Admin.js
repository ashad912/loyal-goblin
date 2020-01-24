import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EventIcon from "@material-ui/icons/Event";
import CreateIcon from "@material-ui/icons/Create";
import PeopleIcon from "@material-ui/icons/People";
import LocalBarIcon from '@material-ui/icons/LocalBar';
import EventSeatIcon from "@material-ui/icons/EventSeat";
import CropFreeIcon from "@material-ui/icons/CropFree";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PersonIcon from '@material-ui/icons/Person';

import { connect } from 'react-redux';
import { Link } from '@material-ui/core';
import {signOut} from '../../store/adminActions/authActions'

import MenuDrawer from "./MenuDrawer";
import AdminEvents from "./pages/AdminEvents";
import AdminItems from "./pages/AdminItems";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminParties from "./pages/AdminParties";
import AdminBarmans from './pages/AdminBarmans'
import AdminReservations from "./pages/AdminReservations";
import AdminOrders from "./pages/AdminOrders";
const drawerWidth = 180;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    justifyContent: "center",
    alignItems: "center"
  },
  toolbar: theme.mixins.toolbar
}));

const Content = styled.div`
  flex-grow: 1;
  padding: 1rem;
`;

const menuItems = [
  { title: "Przedmioty", icon: <CreateIcon />},
  { title: "Produkty", icon: <ShoppingCartIcon />},
  { title: "Wydarzenia", icon: <EventIcon /> },
  { title: "Użytkownicy", icon: <PersonIcon /> },
  { title: "Drużyny", icon: <PeopleIcon /> },
  { title: "Zamówienia", icon: <CropFreeIcon /> },
  { title: "Barmani", icon: <LocalBarIcon /> },
  { title: "Rezerwacje", icon: <EventSeatIcon /> },
];

const Admin = (props) => {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = React.useState("Wydarzenia");

  //LEGACY CHECK SERVER STATUS
  // const handleClick = async () => {
  //     try{
  //         const res = await fetch('/users/me')
  //         console.log(res.json())
  //     } catch (e) {
  //         console.log(e)
  //     }
  // }

  const handleLogout = async e => {
    await props.signOut() 
}

  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  let page;

  switch (currentPage) {
    case "Wydarzenia":
      page = <AdminEvents />;
      break;
    case "Przedmioty":
      page = <AdminItems />;
      break;
    case "Produkty":
      page = <AdminProducts />
      break;
    case "Użytkownicy":
      page = <AdminUsers />;
      break;
    case "Drużyny":
      page = <AdminParties />;
      break;
    case "Barmani":
      page = <AdminBarmans />;
      break;
    case "Rezerwacje":
      page = <AdminReservations />;
      break;
    case "Zamówienia":
      page = <AdminOrders />;
      break;

    default:
      break;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{width: '100%'}}>
          <Typography variant="h6" noWrap style={{flexGrow: 3, textAlign: 'center'}}>
            {currentPage}
          </Typography>
          <Button
              style={{justifyContent: 'flex-end', color: 'white', marginRight: '0.5rem'}}
          >
          <Link onClick={handleLogout} style={{justifyContent: 'flex-end', textAlign: 'right'}} underline='none' color="white">
            <Typography>Wyloguj</Typography>
                
          </Link>
          </Button>
          
        </Toolbar>
      </AppBar>
      <MenuDrawer
        menuItems={menuItems}
        onClick={handlePageChange}
        width={drawerWidth}
      />
      <Content>
        <div className={classes.toolbar} />
        {page}
      </Content>
    </div>

    //  <div onClick={handleClick}>Click to check server (no 404 or 500 error means connection - output in console)</div>
  );
};

const mapStateToProps = (state) => {
  return {
      auth: state.auth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      signOut: () => dispatch(signOut())
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(Admin);
