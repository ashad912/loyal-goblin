import authReducer from './authReducer'
import connectionReducer from './connectionReducer'
import partyReducer from './partyReducer'
import shopReducer from './shopReducer'
import missionReducer from './missionReducer'
import communicationReducer from './communicationReducer'
import rallyReducer from './rallyReducer'

import { combineReducers} from 'redux'



export default combineReducers( {
    auth: authReducer,
    connection: connectionReducer,
    party: partyReducer,
    shop: shopReducer,
    mission: missionReducer,
    rally: rallyReducer,
    communication: communicationReducer
})

export default rootReducer
