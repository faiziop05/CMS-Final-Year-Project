import { createSlice } from '@reduxjs/toolkit';

const initialState= {
  session: '',
  program: '',
  rollNo: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.session = action.payload.session;
      state.program = action.payload.program;
      state.rollNo = action.payload.rollNo;
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
