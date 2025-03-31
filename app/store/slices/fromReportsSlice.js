import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fromReports: false,
};

const fromReportsSlice = createSlice({
  name: "fromReports",
  initialState,
  reducers: {
    setFromReports(state, action) {
      state.fromReports = action.payload;
    },
  },
});

export const { setFromReports } = fromReportsSlice.actions;
export default fromReportsSlice.reducer;
