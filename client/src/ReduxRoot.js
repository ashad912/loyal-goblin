import React from 'react'
import axios from 'axios'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk' //for asynchronous things

import rootReducer from 'store/reducers'
import { refHandler } from 'store/enhancers/refEnhancer'
import { setLoading } from './store/actions/connectionActions'



export default ({ children, initialState = {} }) => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk, refHandler)));

    const { dispatch } = store

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

    

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}