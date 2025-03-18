const initialState = {
  items: [],
};

const goodsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GOODS':
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
};

export default goodsReducer;
