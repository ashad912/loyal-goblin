import authReducer from './authReducer'
import connectionReducer from './connectionReducer'
import { combineReducers} from 'redux'



const rootReducer = combineReducers( {
    auth: authReducer,
    connection: connectionReducer
})

export default rootReducer