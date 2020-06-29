import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk' //for asynchronous things
import rootReducer from 'store/reducers'

export default ({ children, initialState = {}}) => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)));

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}