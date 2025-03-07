import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import authReducer from "./authSlice";
import incidentsReducer from "./incidentsSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  incidents: incidentsReducer,
});

export default rootReducer;
