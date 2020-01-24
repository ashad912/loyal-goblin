import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware, compose} from 'redux' // to enable store func
import rootReducer from './store/reducers/rootReducer'
import { Provider} from 'react-redux' //to wire reducer to App, and choose store
import thunk from 'redux-thunk' //for asynchronous things
import axios from 'axios'
import {setLoading} from './store/actions/connectionActions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose



const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const {dispatch} = store

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.interceptors.request.use(function (config) {
    dispatch(setLoading(true))
    return config;
  }, function (error) {
    dispatch(setLoading(false))
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    dispatch(setLoading(false))
    return response;
  }, function (error) {
    dispatch(setLoading(false))
    return Promise.reject(error);
  });




ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
