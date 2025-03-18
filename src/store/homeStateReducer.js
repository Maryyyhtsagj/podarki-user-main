import {SET_MESSAGES_COUNT, SET_SEARCH_FLAG} from '../constants';

const homeState = {
  searchFlag: false,
  messagesCount: 0,
};

const homeStateReducer = (state = homeState, action) => {
  switch (action.type) {
    case SET_SEARCH_FLAG:
      return {
        ...state,
        searchFlag: action.payload,
      };
    case SET_MESSAGES_COUNT:
      return {
        ...state,
        messagesCount: action.payload,
      };
    default:
      break;
  }
  return state;
};

export default homeStateReducer;
