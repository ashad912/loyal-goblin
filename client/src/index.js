import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ReduxRoot from 'ReduxRoot';

if (process.env.NODE_ENV === 'production') {
  window.oncontextmenu = function () { return false; }
}


ReactDOM.render(
  <ReduxRoot >
    <App />
  </ReduxRoot>,
document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
