const initState = {
  _id: "",
  name: "",
  leader: null,
  members: [],
  inShop: false
};

const partyReducer = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_PARTY":
        return {
          ...state,
          ...action.party
        };
    case "CREATE_PARTY":
      return {
        ...state,
        name: action.name,
        _id: action.partyId,
        leader: action.leader
      };
    case "ADD_MEMBER":
      return {
        ...state,
        ...action.party
      };
    case "REMOVE_MEMBER":
      return {
        ...state,
        ...action.party
      };
      case "GIVE_LEADER":
        return {
          ...state,
          ...action.party
        };
    case "DELETE_PARTY":
      return {
        ...initState
      };
      case "LEAVE_SHOP":
        return {
          ...state,
          inShop: false
        };
    default:
      return state;
  }
};

export default partyReducer;
