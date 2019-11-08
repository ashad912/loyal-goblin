import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { StylesProvider } from "@material-ui/styles";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Root from "./components/Root";
import Shop from "./components/screens/Shop";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import Admin from "./components/admin/Admin";
import Mission from "./components/screens/events/Mission";

import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { connect } from 'react-redux';
import {resetConnectionError} from './store/actions/connectionActions'

import withAuth from "./hoc/withAuth";
import withNoAuth from './hoc/withNoAuth'
import { authCheck } from "./store/actions/authActions";

class App extends React.Component {
  state = {
    fields: [],
    isAdmin: false
  };


  componentDidMount() {
    //FOR PRESENTATION ONLY
    const isAdmin = localStorage.getItem("isAdmin") ? true : false;
    this.setState({ isAdmin });

    //CHECK AUTH ON APP LOAD
    
    this.props.authCheck();
    
  }

  render() {
    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
          {this.state.isAdmin ? (
            <div className="App">
              <Route exact path="/" component={withAuth(Admin)} />
              <Route exact path="/signin" component={withNoAuth(SignIn)} />
            </div>
          ) : (
            <div className="App">
              <Navbar />
                <Switch>
                  <Route exact path="/" component={withAuth(Root)} />
                  <Route exact path="/shop" component={withAuth(Shop)} />
                  <Route exact path="/mission" component={withAuth(Mission)} />
                  <Route exact path="/signin" component={withNoAuth(SignIn)} />
                  <Route exact path="/signup" component={withNoAuth(SignUp)} />
                  <Route exact path="/lost-password" component={withNoAuth(ForgotPassword)} />
                  <Route exact path="/admin" component={Admin} />
                </Switch>
              <Footer />
            </div>
          )}
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.props.connection.connectionError}
            onClose={this.props.resetConnectionError}
            autoHideDuration={3000}
            message={
              <span>
                Brak połączenia z serwerem.
              </span>
            }
          />
            <Dialog open={this.props.connection.loading} >
              <DialogContent style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10', height: '10rem', width: '10rem'}}>
                  <CircularProgress style={{height: 100, width: 100}}/>
              </DialogContent>
          </Dialog>
        </StylesProvider>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      connection: state.connection,
      auth: state.auth
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
      resetConnectionError: () => dispatch(resetConnectionError()),
      authCheck: () => dispatch(authCheck())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
