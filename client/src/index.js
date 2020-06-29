import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios'
import {setLoading} from './store/actions/connectionActions'
import ReduxRoot from 'ReduxRoot';

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

if(process.env.NODE_ENV === 'production'){
  window.oncontextmenu = function() { return false; }
}


ReactDOM.render(
  <ReduxRoot >
    <App/>
  </ReduxRoot>,
  document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
