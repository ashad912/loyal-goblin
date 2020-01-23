const initState = {
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
      default:
        return state;
    }
  };
  
  export default missionReducer;