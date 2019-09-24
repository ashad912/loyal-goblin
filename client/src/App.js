import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { StylesProvider } from "@material-ui/styles";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Root from "./components/Root";
import Shop from "./components/screens/Shop";
import SignIn from "./components/auth/SignIn";
import Admin from "./components/Admin";
import Mission from "./components/screens/events/Mission";

import withAuth from "./hoc/withAuth";

class App extends React.Component {
  state = {
    fields: []
  };

  render() {
    return (
      <BrowserRouter>
        <StylesProvider injectFirst>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={withAuth(Root)} />
              <Route exact path="/shop" component={withAuth(Shop)} />
              <Route exact path="/mission" component={withAuth(Mission)} />
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/console" component={Admin} />
            </Switch>
            <Footer />
          </div>
        </StylesProvider>
      </BrowserRouter>
    );
  }
}

export default App;
