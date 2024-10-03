import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  fullName: "",
  homeAddress: "",
  password: "",
  phoneNo: "",
  program: "",
  session: "",
  semester: "",
  username: "",
  expoPushToken:"",
  Assignedcourses: [],

};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload._id;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.homeAddress = action.payload.homeAddress;
      state.password = action.payload.password;
      state.phoneNo = action.payload.phoneNo;
      state.session = action.payload.session;
      state.program = action.payload.program;
      state.semester = action.payload.semester;
      state.username = action.payload.username;
      state.expoPushToken = action.payload.expoPushToken;
      state.Assignedcourses = action.payload.Assignedcourses;
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
