import { configureStore } from "@reduxjs/toolkit";
import timelineSlice from "./timelineSlice";
import adminSlice from "./adminSlice";

export const store = configureStore({
    reducer: {
        timelineSlice,
        adminSlice,
    },
})