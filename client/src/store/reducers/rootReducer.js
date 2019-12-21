import authReducer from './authReducer'
import connectionReducer from './connectionReducer'
import partyReducer from './partyReducer'
import shopReducer from './shopReducer'
import missionReducer from './missionReducer'
import { combineReducers} from 'redux'



const rootReducer = combineReducers( {
    auth: authReducer,
    connection: connectionReducer,
    party: partyReducer,
    shop: shopReducer,
    mission: missionReducer
})

export default rootReducer