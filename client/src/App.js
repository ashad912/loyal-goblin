import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Root from './components/Root'
import SignIn from './components/auth/SignIn'
import Admin from './components/Admin'



class App extends React.Component {

  state = {
    fields: []
  }


  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
            <Switch>
              <Route exact path = '/' component={Root}/>
              <Route exact path = '/signin' component={SignIn}/>
              <Route exact path = '/console' component={Admin}/>
            </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
