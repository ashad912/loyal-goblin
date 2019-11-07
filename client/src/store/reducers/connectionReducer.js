//import {labels} from '../../components/strings/labels'

const initState = {
    connectionError: null,
    loading: null,
    
};


const connectionReducer = (state = initState, action) => {
    switch (action.type){ //it ll generate thing to authReducer not firebaseReducer remember!
        case 'NO_CONNECTION':
            console.log("no connection")
            return {
                ...state,
                connectionError: true,
        }
        case 'RESET_CONNECTION_ERROR':
            console.log("reset connection error")
            return {
                ...state,
                connectionError: null,
        }
        case 'LOADING':
            if(action.loading){
                console.log('loading start')
            }else{
                console.log('loading end')
            }
            return {
                ...state,
                loading: action.loading
            }
        default:
            return state;
    }
}


export default connectionReducer