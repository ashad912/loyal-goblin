import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware, compose} from 'redux' // to enable store func
import rootReducer from './store/reducers/rootReducer'
import { Provider} from 'react-redux' //to wire reducer to App, and choose store
import thunk from 'redux-thunk' //for asynchronous things


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose



const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));



ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
