import { combineReducers } from "@reduxjs/toolkit";
import fromReportsReducer from "./fromReportsSlice";
import authReducer from "./authSlice";
import incidentsReducer from "./incidentsSlice";

const rootReducer = combineReducers({
  fromReports: fromReportsReducer,
  auth: authReducer,
  incidents: incidentsReducer,
});

export default rootReducer;
