//import {labels} from '../../components/strings/labels'

const initState = {
    connectionError: null,
    loading: true,
    message: "Brak połączenia z serwerem."
};


const connectionReducer = (state = initState, action) => {
    switch (action.type){ //it ll generate thing to authReducer not firebaseReducer remember!
        case 'NO_CONNECTION':
            //console.log("no connection")
            //console.log(action.error.message)
            // let message = "Brak połączenia z serwerem."
            // if(action.error.message === "Network Error"){
            //     message = "Maksymalna wielkosć pliku to 6 MB!"
            // }
            return {
                ...state,
                connectionError: true,
                //message: message
        }
        case 'RESET_CONNECTION_ERROR':
            //console.log("reset connection error")
            return {
                ...state,
                connectionError: null,
                message:"Brak połączenia z serwerem."
        }
        case 'LOADING':
            if(action.loading){
                //console.log('loading start')
            }else{
               // console.log('loading end')
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