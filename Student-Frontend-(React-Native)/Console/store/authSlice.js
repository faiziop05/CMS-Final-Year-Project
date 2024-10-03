import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  notificationsList: [],
  notificationDispatchState: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setNotificationDispatchState: (state, action) => {
      state.notificationDispatchState = action.payload;
    },
    addNotificationList: (state, action) => {
      return {
        ...state,
        notificationsList: [action.payload, ...state.notificationsList],
      };
    },
    clearNotificationsList: (state) => {
      state.notificationsList = []; // Clear notificationsList
    },
  },
});

export const {
  login,
  logout,
  setIsLoggedIn,
  addNotificationList,
  clearNotificationsList,
  setNotificationDispatchState
} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
