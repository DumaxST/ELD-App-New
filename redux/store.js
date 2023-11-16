import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import eldReducer from "./reducers";
import editingReducers from "./editingReducers";

const rootReducer = combineReducers({
  eldReducer,
  editingReducers,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

