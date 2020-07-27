import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Workbox, messageSW } from 'workbox-window';
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import styled from "styled-components";
import "./App.css";

import SocketConfig from "./SocketConfig";
import withAuth from "./hoc/withAuth";
import withNoAuth from "./hoc/withNoAuth";
import ConnectionSpinnerDialog from "./components/layout/ConnectionSpinnerDialog";
import ConnectionSnackbar from "./components/layout/ConnectionSnackbar";
import ResetPassword from "./components/auth/ResetPassword";
import PageNotFound from "./components/layout/PageNotFound";
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/Footer";
import TabsRoot from "./components/tabs/TabsRoot";
import Shop from "./components/shop/Shop";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import MissionInstance from "./components/missionInstance";
import Loading from "components/layout/Loading";
import OfflineModal from "./components/auth/OfflineModal";
import Demo from "./components/auth/Demo";

import CharacterCreation from "components/characterCreation/CharacterCreation";


import { palette } from "./utils/constants";

import { authCheck } from "./store/actions/authActions";
import { resetConnectionError } from "./store/actions/connectionActions";
import { updateParty } from "./store/actions/partyActions";


const goblinTheme = createMuiTheme({
  palette: {
    primary: {
      light: palette.primary.light,
      main: palette.primary.main,
      dark: palette.primary.dark,
      contrastText: palette.primary.contrastText
    },
    secondary: {
      light: palette.secondary.light,
      main: palette.secondary.main,
      dark: palette.secondary.dark,
      contrastText: palette.secondary.contrastText
    }
  },
  typography: {
    fontFamily: '"Pinto-3", "Helvetica", "Arial", sans-serif',
  }
});

const Toast = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  background: black;
  color: rgba(255, 255, 255, 1);
  display: none;
  text-align: center;
  padding: 2rem 0;
  font-size: 2rem;
`;

const AppRoot = styled.div`
   @media (min-width: 450px) {
    max-width: 450px;
    margin: 0 auto;
   }
`

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    online: true,
    loaded: false,
    HomeComponent: Loading
  }


  async componentDidMount() {
    const prod = process.env.NODE_ENV === 'production'
    const online = prod ? navigator.onLine : true

    window.addEventListener("popstate", e => {
      // Reload after popstate (to update client)
      window.location.reload()
    });


    if (prod) {
      window.addEventListener('online', this.handleOnlineState, false);
      window.addEventListener('offline', this.handleOfflineState, false);

    }

    if (prod && 'serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      let registration;

      const showSkipWaitingPrompt = (event) => {
        // `event.wasWaitingBeforeRegister` will be false if this is
        // the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously
        // updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.

        // Assumes your app has some sort of prompt UI element
        // that a user can either accept or reject.

        alert("Aplikacja została zaktualizowana! Zatwierdź, by wczytać nową wersję.")

        // Assuming the user accepted the update, set up a listener
        // that will reload the page as soon as the previously waiting
        // service worker has taken control.
        wb.addEventListener('controlling', (event) => {
          window.location.reload();
        });

        if (registration && registration.waiting) {
          // Send a message to the waiting service worker,
          // instructing it to activate.  
          // Note: for this to work, you have to add a message
          // listener in your service worker. See below.
          messageSW(registration.waiting, { type: 'SKIP_WAITING' });
        }



      }

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      wb.addEventListener('waiting', showSkipWaitingPrompt);
      wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

      registration = await wb.register();
    }



    //HISTORY BACK PREVENT - https://medium.com/@subwaymatch/disabling-back-button-in-react-with-react-router-v5-34bb316c99d7
    //history.listen(...), history.go(...)

    //CHECK AUTH ON APP LOAD
    if (online) {

      const user = await this.props.authCheck();
      const charCreated = user && user.name && user.class
      const HomeComponent = charCreated ? TabsRoot : CharacterCreation


      this.setupComponent(HomeComponent, charCreated)




    } else {
      this.setState({ online: false })
    }
  }

  setupComponent(HomeComponent, condition) {
    this.setState({
      HomeComponent,
      loaded: true
    }, () => {

      if (condition) {
        //Update profile data on first full hour and after next 60 minutes
        this.firstUpdate = setTimeout(() => {
          this.props.authCheck({ autoFetch: true });
          this.props.onPartyUpdate({ autoFetch: true });
          this.nextUpdates = setInterval(() => {
            this.props.authCheck({ autoFetch: true });
            this.props.onPartyUpdate({ autoFetch: true });
          }, 3600000);
        }, 3601000 - (new Date().getTime() % 3600000));


        //For testing
        // setTimeout(() => {
        //   this.props.authCheck();
        //   this.props.onPartyUpdate()
        // }, 5000);
      }

    })
  }

  unmountTimers() {
    clearTimeout(this.firstUpdate);
    clearInterval(this.nextUpdates);
  }

  componentWillUnmount() {
    this.unmountTimers()
    window.removeEventListener('online', this.handleOnlineState, false);
    window.removeEventListener('offline', this.handleOfflineState, false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.online !== this.state.online && this.state.online) {
      window.location.reload()
    }

    if (this.state.loaded && (!prevProps.userName && this.props.userName)) {
      this.setupComponent(TabsRoot, true)
    }

    if (this.state.loaded && (prevProps.userName && !this.props.userName)) {
      this.unmountTimers()
      this.setupComponent(CharacterCreation, true)
    }
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

  handleOnlineState = () => {
    this.setState({ online: true })
  }

  handleOfflineState = () => {
    this.setState({ online: false })
  }

  render() {

    if (!this.state.online) {
      return (
        <StylesProvider injectFirst>
          <ThemeProvider theme={goblinTheme}>
            <OfflineModal open={!this.state.online} />
          </ThemeProvider>
        </StylesProvider>
      )
    }

    if (!this.state.loaded) {
      return null
    }


    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
          <ThemeProvider theme={goblinTheme}>
            <div className="App">
              <Navbar />
              <Switch>
                <Route exact path="/" component={withAuth(this.state.HomeComponent)} />
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
                <Route
                  exact
                  path="/demo/:key"
                  component={withNoAuth(Demo)}
                />
                <Route component={PageNotFound} />
              </Switch>
              <Footer />
            </div>

            <ConnectionSnackbar
              resetConnectionError={() => this.props.resetConnectionError()}
            />
            <ConnectionSpinnerDialog />
            <SocketConfig />
            <OfflineModal open={!this.state.online} />
          </ThemeProvider>
        </StylesProvider>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userName: state.auth.profile.name,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetConnectionError: () => dispatch(resetConnectionError()),
    authCheck: () => dispatch(authCheck()),
    onPartyUpdate: () => dispatch(updateParty())
  };
};

//redux compose to join with hoc/router
export default connect(mapStateToProps, mapDispatchToProps)(App);