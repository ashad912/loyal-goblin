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
import MissionInstance from "./components/screens/events/MissionInstance";

import { connect } from "react-redux";
import { resetConnectionError } from "./store/actions/connectionActions";

import withAuth from "./hoc/withAuth";
import withNoAuth from "./hoc/withNoAuth";
import { authCheck, registerForEvents } from "./store/actions/authActions";
import { updateParty } from "./store/actions/partyActions";
import ConnectionSpinnerDialog from "./components/layout/ConnectionSpinnerDialog";
import ConnectionSnackbar from "./components/layout/ConnectionSnackbar";

import {socket, joinRoomSubscribe, leaveRoomSubscribe, refreshRoomSubscribe, deleteRoomSubscribe} from './socket'

class App extends React.Component {
  state = {
    fields: [],
    isAdmin: false
  };

  async componentDidMount() {
    //FOR PRESENTATION ONLY
    const isAdmin = localStorage.getItem("isAdmin") ? true : false;
    this.setState({ isAdmin });

    //CHECK AUTH ON APP LOAD
    const uid = await this.props.authCheck();

    joinRoomSubscribe((roomId) => {
      console.log(roomId)
      this.props.onPartyUpdate()
    })

    leaveRoomSubscribe((socketUserIdToLeave) => {
      console.log(uid, socketUserIdToLeave)
      if(uid === socketUserIdToLeave && socket.connected){
        socket.disconnect()
      }
      this.props.onPartyUpdate()
      
      
    })

    refreshRoomSubscribe((roomId) => {
      this.props.onPartyUpdate()
    })

    deleteRoomSubscribe((roomId) => {
      if(socket.connected){
        socket.disconnect()
      }
      this.props.onPartyUpdate()
    })
     
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
                <Route exact path="/admin" component={Admin} />
              </Switch>
              <Footer />
            </div>
          )}

         <ConnectionSnackbar />
          <ConnectionSpinnerDialog />
         
        </StylesProvider>
      </BrowserRouter>
    );
  }
}



const mapDispatchToProps = dispatch => {
  return {
    resetConnectionError: () => dispatch(resetConnectionError()),
    authCheck: () => dispatch(authCheck()),
    onPartyUpdate: () => dispatch(updateParty())
  };
};

export default connect(null, mapDispatchToProps)(App);
