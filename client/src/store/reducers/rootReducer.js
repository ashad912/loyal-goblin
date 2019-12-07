import authReducer from './authReducer'
import connectionReducer from './connectionReducer'
import partyReducer from './partyReducer'
import { combineReducers} from 'redux'



const rootReducer = combineReducers( {
    auth: authReducer,
    connection: connectionReducer,
    party: partyReducer
})

export default rootReducer