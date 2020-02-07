//import {labels} from '../../components/strings/labels'

const initState = {
  init: true,
  uid: null,
  profile: {},
  authError: null,
  multipleSession: false,
  allNames: []
};

const authReducer = (state = initState, action) => {
  switch (
    action.type //it ll generate thing to authReducer not firebaseReducer remember!
  ) {
    case "LOGIN_ERROR":
      //console.log("login error");
      return {
        ...state,
        authError: "Logowanie nieudane"
      };
    case "SIGNUP_ERROR":
      //console.log("signup error");
      let message = "Błąd rejestracji"

      switch (action.messageCode) {
        case 11000:
          message = "Podany adres e-mail już istnieje"
          break;
        default: 
          break;
      }

      return {
        ...state,
        authError: message
      };
    case "LOGIN_SUCCESS":
      //console.log("login success");
      return {
        ...state,
        profile: action.profile,
        uid: action.uid,
        authError: null
      };
    case "LOGOUT_SUCCESS":
      //console.log("signout success");
      return {
        ...state,
        profile: {},
        uid: null
      };
    case "NO_AUTH":
      //console.log("no auth");
      return {
        ...state,
        profile: {},
        uid: null,
        init: false
      };
    case "AUTH_SUCCESS":
      //console.log("auth success");
      return {
        ...state,
        profile: action.profile,
        uid: action.uid,
        init: false
      };
    case "UPDATE_PROFILE_DATA":
      return {
        ...state,
        profile: action.profile,
        init: false
      };
      case "UPDATE_PROFILE_BAG":
        const tempProfile = {...state.profile}
        tempProfile.bag = [...action.bag]
        return {
          ...state,
          profile: tempProfile,
          init: false
        };
    case "UPDATE_ACTIVE_ORDER":
      const profile = {...state.profile}
      profile.activeOrder = action.activeOrder
      return {
        ...state,
        profile: {...profile},
        init: false
      };
    case 'MULTIPLE_SESSION':
      return{
        ...state,
        multipleSession: true
      }
      case 'GET_ALL_NAMES':
        const allNames = action.names.map(user => user.name)
        return{
          ...state,
          allNames: allNames
        }
        case 'CLEAR_ALL_NAMES':
          return{
            ...state,
            allNames: []
          }
    default:
      return state;
  }
};

export default authReducer;
