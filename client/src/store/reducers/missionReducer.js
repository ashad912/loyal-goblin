const initState = {
    activeInstanceId: null
  };
  
  const missionReducer = (state = initState, action) => {
    switch (action.type) {
      case "SET_INSTANCE_ID":
          return {
            ...state,
            activeInstanceId: action.id
          };
      default:
        return state;
    }
  };
  
  export default missionReducer;