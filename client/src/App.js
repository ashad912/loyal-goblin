import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
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
import PageNotFound from "./components/screens/PageNotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Root from "./components/Root";
import Shop from "./components/screens/Shop";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ForgotPassword from "./components/auth/ForgotPassword";
import MissionInstance from "./components/screens/events/MissionInstance";

import { palette } from "./utils/definitions";

import { authCheck } from "./store/actions/authActions";
import { resetConnectionError } from "./store/actions/connectionActions";
import { updateParty } from "./store/actions/partyActions";
import OfflineModal from "./components/auth/OfflineModal";

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
    fontFamily: '"Pinto", "Helvetica", "Arial", sans-serif',
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

class App extends React.Component {

  constructor(props){
    super(props);
    this.handleOnlineState = this.handleOnlineState.bind(this); 
    this.handleOfflineState = this.handleOfflineState.bind(this); 
}

state = {
  online: true
}


  async componentDidMount() {

    window.addEventListener('online', this.handleOnlineState, false);
    window.addEventListener('offline', this.handleOfflineState, false);

    //CHECK AUTH ON APP LOAD
    if(navigator.onLine){

      await this.props.authCheck();
  
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
    }else{
      this.setState({online: false})
    }
  }

  componentWillUnmount() {
    clearTimeout(this.firstUpdate);
    clearInterval(this.nextUpdates);
    window.removeEventListener('online', this.handleOnlineState, false);
    window.removeEventListener('offline', this.handleOfflineState, false);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.online !== this.state.online && this.state.online){
      window.location.reload()
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

  closeToast = () => {
    document.getElementById("toast").style.display = "none";
  };

  handleOnlineState = () => {
    this.setState({online: true})
  }

  handleOfflineState = () => {
    this.setState({online: false})
  }

  render() {
    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
          <ThemeProvider theme={goblinTheme}>
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
                <Route component={PageNotFound} />
              </Switch>
              <Footer />
            </div>

            <ConnectionSnackbar
              resetConnectionError={() => this.props.resetConnectionError()}
            />
            <ConnectionSpinnerDialog />
            <SocketConfig />
            <Toast id="toast" onClick={this.closeToast}>
              Dostępna aktualizacja!
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "lighter",
                  color: "rgba(220, 220, 220, 1)"
                }}
              >
                Zamknij aplikację i uruchom ją ponownie.
              </p>
            </Toast>
            <OfflineModal open={!this.state.online}/>
          </ThemeProvider>
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
