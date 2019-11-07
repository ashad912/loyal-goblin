//import {labels} from '../../components/strings/labels'

const initState = {
    uid: null,
    profile: {},
    authError: null,
    
};


const authReducer = (state = initState, action) => {
    switch (action.type){ //it ll generate thing to authReducer not firebaseReducer remember!
        case 'LOGIN_ERROR':
            console.log('login error')
            return {
                ...state,
                authError: 'Login failed'
            }
        case 'LOGIN_SUCCESS':
            console.log('login success')
            return {
                ...state,
                uid: action.uid,
                authError: null,
            }
        case 'LOGOUT_SUCCESS':
            console.log('signout success');
            return {
                ...state,
                profile: {},
                uid: null,
            };
        case 'NO_AUTH':
            console.log("no auth")
            return {
                ...state,
                profile: {},
                uid: null,
            }
        case 'AUTH_SUCCESS':
            console.log("auth success")
            return {
                ...state,
                profile: action.profile,
                uid: action.uid,
            }

        default:
            return state;
    }
}


export default authReducer