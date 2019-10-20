import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import EventIcon from "@material-ui/icons/Event";
import CreateIcon from "@material-ui/icons/Create";
import PeopleIcon from "@material-ui/icons/People";
import LocalBarIcon from '@material-ui/icons/LocalBar';
import EventSeatIcon from "@material-ui/icons/EventSeat";
import CropFreeIcon from "@material-ui/icons/CropFree";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import MenuDrawer from "./MenuDrawer";
import AdminMissions from "./Pages/AdminMissions";
import AdminItems from "./Pages/AdminItems";
import AdminProducts from "./Pages/AdminProducts";
import AdminUsers from "./Pages/AdminUsers";
import AdminBarmans from './Pages/AdminBarmans'
import AdminReservations from "./Pages/AdminReservations";
import AdminQR from "./Pages/AdminQR";
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
  { title: "Misje", icon: <EventIcon /> },
  { title: "Przedmioty", icon: <CreateIcon />},
  { title: "Produkty", icon: <ShoppingCartIcon />},
  { title: "Użytkownicy", icon: <PeopleIcon /> },
  { title: "Barmani", icon: <LocalBarIcon /> },
  { title: "Rezerwacje", icon: <EventSeatIcon /> },
  { title: "QR", icon: <CropFreeIcon /> }
];

const Admin = () => {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = React.useState("Misje");

  //LEGACY CHECK SERVER STATUS
  // const handleClick = async () => {
  //     try{
  //         const res = await fetch('/users/me')
  //         console.log(res.json())
  //     } catch (e) {
  //         console.log(e)
  //     }
  // }

  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  let page;

  switch (currentPage) {
    case "Misje":
      page = <AdminMissions />;
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
      case "Barmani":
        page = <AdminBarmans />;
        break;
    case "Rezerwacje":
      page = <AdminReservations />;
      break;
    case "QR":
      page = <AdminQR />;
      break;

    default:
      break;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {currentPage}
          </Typography>
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

export default Admin;
