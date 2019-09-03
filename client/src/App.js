import React from 'react';
import logo from './logo.svg';
import './App.css';
import ShipBoard from './components/ShipBoard';

class App extends React.Component {

  state = {
    fields: []
  }


  render(){
    return (
      <div className="App">
          <ShipBoard />
      </div>
    );
  }
}

export default App;
