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
import Admin from "./components/Admin/Admin";
import Mission from "./components/screens/events/Mission";

import withAuth from "./hoc/withAuth";

class App extends React.Component {
  state = {
    fields: [],
    isAdmin: false
  };


  //FOR PRESENTATION ONLY
  componentDidMount() {
    const isAdmin = localStorage.getItem("isAdmin") ? true : false;
    this.setState({ isAdmin });
  }

  render() {
    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
          {this.state.isAdmin ? (
            <div className="App">
              <Route exact path="/" component={withAuth(Admin)} />
            </div>
          ) : (
            <div className="App">
              <Navbar />
              <Switch>
                <Route exact path="/" component={withAuth(Root)} />
                <Route exact path="/shop" component={withAuth(Shop)} />
                <Route exact path="/mission" component={withAuth(Mission)} />
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/lost-password" component={ForgotPassword} />
                <Route exact path="/admin" component={Admin} />
              </Switch>
              <Footer />
            </div>
          )}
        </StylesProvider>
      </BrowserRouter>
    );
  }
}

export default App;
