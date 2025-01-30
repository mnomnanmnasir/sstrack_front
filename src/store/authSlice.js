// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null, // Start with no token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload; // Update token in Redux state
    },
    clearAuth(state) {
      state.token = null; // Clear token on logout
    },
  },
});

export const { setToken, clearAuth } = authSlice.actions;

export default authSlice.reducer;
