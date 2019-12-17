//import {labels} from '../../components/strings/labels'

const initState = {
  init: true,
  uid: null,
  profile: {},
  authError: null,
  multipleSession: false,
};

const authReducer = (state = initState, action) => {
  switch (
    action.type //it ll generate thing to authReducer not firebaseReducer remember!
  ) {
    case "LOGIN_ERROR":
      console.log("login error");
      return {
        ...state,
        authError: "Login failed"
      };
    case "LOGIN_SUCCESS":
      console.log("login success");
      return {
        ...state,
        profile: action.profile,
        uid: action.uid,
        authError: null
      };
    case "LOGOUT_SUCCESS":
      console.log("signout success");
      return {
        ...state,
        profile: {},
        uid: null
      };
    case "NO_AUTH":
      console.log("no auth");
      return {
        ...state,
        profile: {},
        uid: null,
        init: false
      };
    case "AUTH_SUCCESS":
      console.log("auth success");
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
    default:
      return state;
  }
};

export default authReducer;
