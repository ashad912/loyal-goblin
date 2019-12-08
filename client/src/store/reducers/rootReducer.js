import authReducer from './authReducer'
import connectionReducer from './connectionReducer'
import partyReducer from './partyReducer'
import shopReducer from './shopReducer'
import { combineReducers} from 'redux'



const rootReducer = combineReducers( {
    auth: authReducer,
    connection: connectionReducer,
    party: partyReducer,
    shop: shopReducer
})

export default rootReducer