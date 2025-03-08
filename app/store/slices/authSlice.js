import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  email: null,
  loading: false,
  error: null,
  otpRequired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.email = action.payload.email;
      state.otpRequired = action.payload.otpRequired;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    otpVerificationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.otpRequired = false;
    },
    otpVerificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signout: (state) => {
      state.token = null;
      state.user = null;
      state.email = null;
      state.otpRequired = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  otpVerificationStart,
  otpVerificationSuccess,
  otpVerificationFailure,
  signout,
} = authSlice.actions;
export default authSlice.reducer;
