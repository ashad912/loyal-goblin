import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import styled from "styled-components";
//import Footer from "./components/layout/Footer";
import SignIn from "./auth/SignIn";
import Admin from "./components/Admin";
import withAuth from "./hoc/withAuth";
import withNoAuth from "./hoc/withNoAuth";
import ConnectionSpinnerDialog from "./layout/ConnectionSpinnerDialog";
import ConnectionSnackbar from "./layout/ConnectionSnackbar";
import PageNotFound from "./components/PageNotFound";

import { authCheck} from "./store/actions/authActions";
import { resetConnectionError } from "./store/actions/connectionActions";


const goblinTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#66bb6a",
      main: "#388e3c",
      dark: "#1b5e20",
      contrastText: "#fff"
    },
    secondary: {
      light: "#f44336",
      main: "#e53935",
      dark: "#b71c1c",
      contrastText: "#000"
    }
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
  state = {

  };

  async componentDidMount() {


    //CHECK AUTH ON APP LOAD
    await this.props.authCheck();

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

  
  closeToast = () => {
    document.getElementById("toast").style.display = "none";
  };

  render() {
    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
        <ThemeProvider theme={goblinTheme}>

            <div className="App">
              <Switch>
                <Route exact path="/" component={withAuth(Admin)} />
                <Route exact path="/signin" component={withNoAuth(SignIn)} />
                <Route component={PageNotFound}/>
              </Switch>
            </div>
          
          <ConnectionSnackbar resetConnectionError = {() => this.props.resetConnectionError()}/>
          <ConnectionSpinnerDialog />
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
  };
};

export default connect(null, mapDispatchToProps)(App);
