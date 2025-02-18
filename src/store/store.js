import { configureStore } from "@reduxjs/toolkit";
import timelineSlice from "./timelineSlice";
import adminSlice from "./adminSlice";
import authReducer from './authSlice'; 

export const store = configureStore({
    reducer: {
        timelineSlice,
        adminSlice,
        auth: authReducer,
    },
})