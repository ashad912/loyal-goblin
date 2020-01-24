import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { StylesProvider } from "@material-ui/styles";
import "./App.css";


import SocketConfig from "./SocketConfig"
import withAuth from "./hoc/withAuth";
import withNoAuth from "./hoc/withNoAuth";
import ConnectionSpinnerDialog from "./components/layout/ConnectionSpinnerDialog";
import ConnectionSnackbar from "./components/layout/ConnectionSnackbar";
import ResetPassword from "./components/auth/ResetPassword";
import PageNotFound from "./components/screens/PageNotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Root from "./components/Root";
import Shop from "./components/screens/Shop";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import MissionInstance from "./components/screens/events/MissionInstance";

import { authCheck, setMultipleSession } from "./store/actions/authActions";
import { resetConnectionError } from "./store/actions/connectionActions";
import { updateParty } from "./store/actions/partyActions";

class App extends React.Component {
  state = {};

  async componentDidMount() {
    //CHECK AUTH ON APP LOAD
    await this.props.authCheck();

    //Update profile data on first full hour and after next 60 minutes
    this.firstUpdate = setTimeout(() => {
      this.props.authCheck({autoFetch: true});
      this.props.onPartyUpdate({autoFetch: true})
      this.nextUpdates = setInterval(() => {
        this.props.authCheck({autoFetch: true});
        this.props.onPartyUpdate({autoFetch: true})
      }, 3600000)
    }, 3601000 - (new Date().getTime() % 3600000));

    //For testing
    // setTimeout(() => {
    //   this.props.authCheck();
    //   this.props.onPartyUpdate()
    // }, 5000);

     
  }

  componentWillUnmount() {
    clearTimeout(this.firstUpdate);
    clearInterval(this.nextUpdates);
  }

  componentDidUpdate(prevProps, prevState) {
    //USEFUL COMPONENT UPDATE DIAGNOSTICS
    // Object.entries(this.props).forEach(
    //   ([key, val]) =>
    //     prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    // );
    // if (this.state) {
    //   Object.entries(this.state).forEach(
    //     ([key, val]) =>
    //       prevState[key] !== val && console.log(`State '${key}' changed`)
    //   );
    // }
  }

  render() {
    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
        
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={withAuth(Root)} />
              <Route exact path="/shop" component={withAuth(Shop)} />
              <Route
                exact
                path="/mission"
                component={withAuth(MissionInstance)}
              />
              <Route exact path="/signin" component={withNoAuth(SignIn)} />
              <Route exact path="/signup" component={withNoAuth(SignUp)} />
              <Route
                exact
                path="/lost-password"
                component={withNoAuth(ForgotPassword)}
              />
              <Route
                exact
                path="/reset/:token"
                component={withNoAuth(ResetPassword)}
              />
              <Route component={PageNotFound}/>
            </Switch>
            <Footer />
          </div>
          
          
          <ConnectionSnackbar resetConnectionError = {() => this.props.resetConnectionError()}/>
          <ConnectionSpinnerDialog />
          <SocketConfig />
        </StylesProvider>
      </BrowserRouter>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setMultipleSession: () => dispatch(setMultipleSession()),
    resetConnectionError: () => dispatch(resetConnectionError()),
    authCheck: () => dispatch(authCheck()),
    onPartyUpdate: () => dispatch(updateParty())
  };
};

export default connect(null, mapDispatchToProps)(App);
