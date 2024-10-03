import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  courses: [],
  RegisteredStudents: [],
  teacherId: localStorage.getItem("teacherId") || null, // Load teacherId from local storage
  adminId: localStorage.getItem("adminId") || null, // Load teacherId from local storage
  coordinatorId: localStorage.getItem("coordinatorId") || null, // Load teacherId from local storage
  courseId: localStorage.getItem("courseId") || null, // Load courseId from local storage
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.teacherId = action.payload.teacherId;
      state.adminId = action.payload.adminId;
      state.coordinatorId = action.payload.coordinatorId;
      localStorage.setItem("teacherId", action.payload.teacherId); // Save teacherId to local storage
      localStorage.setItem("adminId", action.payload.adminId); // Save teacherId to local storage
      localStorage.setItem("coordinatorId", action.payload.coordinatorId); // Save teacherId to local storage
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.teacherId = null;
      state.adminId = null;
      state.coordinatorId = null;
      localStorage.removeItem("teacherId"); // Remove teacherId from local storage
      localStorage.removeItem("adminId"); // Remove teacherId from local storage
      localStorage.removeItem("coordinatorId"); // Remove teacherId from local storage
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setCourses: (state, action) => {
      state.courses = [action.payload, ...state.courses];
    },
    setRegisteredStudents: (state, action) => {
      state.RegisteredStudents = [action.payload, ...state.RegisteredStudents];
    },
    setTeacherId: (state, action) => {
      state.teacherId = action.payload;
      localStorage.setItem("teacherId", action.payload); // Save teacherId to local storage
    },
    setAdminId: (state, action) => {
      state.adminId = action.payload;
      localStorage.setItem("adminId", action.payload); // Save teacherId to local storage
    },
    setCoordinatorId: (state, action) => {
      state.coordinatorId = action.payload;
      localStorage.setItem("coordinatorId", action.payload); // Save teacherId to local storage
    },
    setCourseId: (state, action) => {
      state.courseId = action.payload;
      localStorage.setItem("courseId", action.payload); // Save courseId to local storage
    },
  },
});

export const {
  login,
  logout,
  setIsLoggedIn,
  setCourses,
  setRegisteredStudents,
  setTeacherId,
  setCourseId,
  setAdminId,
  setCoordinatorId,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
