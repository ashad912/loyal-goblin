
const initState = {
  init: true,
  uid: null,
  authError: null,
};

const authReducer = (state = initState, action) => {
  switch ( action.type ) {
    case "LOGIN_ERROR":
      console.log("login error");
      return {
        ...state,
        authError: "Logowanie nieudane"
      };
    
    case "LOGIN_SUCCESS":
      console.log("login success");
      return {
        ...state,
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
        uid: null,
        init: false
      };
    case "AUTH_SUCCESS":
      console.log("auth success");
      return {
        ...state,
        uid: action.uid,
        init: false
      };
    default:
      return state;
  }
};

export default authReducer;
