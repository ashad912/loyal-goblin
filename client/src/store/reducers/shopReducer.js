export const initState = {
  products: []
};

const shopReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_SHOP":
      return {
        ...state,
        products: [...action.shop]
      };
    case "UPDATE_SHOP":
      return {
        ...state,
        products: [...action.shop]
      };

    default:
      return state;
  }
};

export default shopReducer;
