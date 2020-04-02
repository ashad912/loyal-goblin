const initState = {
    missions: [],
    activeInstanceId: null,
    activeInstanceImgSrc: null
  };
  
  const missionReducer = (state = initState, action) => {
    switch (action.type) {
      case "SET_INSTANCE":
          return {
            ...state,
            activeInstanceId: action.id,
            activeInstanceImgSrc: action.imgSrc
          };
      case "UPDATE_MISSIONS":
          return {
            ...state,
            missions: action.missions
          };
      default:
        return state;
    }
  };
  
  export default missionReducer;