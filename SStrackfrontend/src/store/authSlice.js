import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('authToken') || null, // Store token only
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); // Save token in localStorage
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token'); // Remove token on logout
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
