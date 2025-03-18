import {combineReducers, legacy_createStore as createStore} from 'redux';
import userReducer from './customerReducer';
import ActiveStore from './activeStore';
import filterReducer from './filterReducer';
import goodsReducer from './goodsReducer';
import homeStateReducer from './homeStateReducer';

const store = createStore(
  combineReducers({
    customer: userReducer,
    activeStore: ActiveStore,
    filter: filterReducer,
    homeState: homeStateReducer,
    goods: goodsReducer,
  }),
);

export default store;
