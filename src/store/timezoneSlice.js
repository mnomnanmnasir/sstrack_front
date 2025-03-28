import { createSlice } from "@reduxjs/toolkit";

const timezoneSlice = createSlice({
    name: "timezone",
    initialState: {
        selectedTimezone: "All", // Default timezone
    },
    reducers: {
        setSelectedTimezone: (state, action) => {
            state.selectedTimezone = action.payload;
        },
    },
});

export const { setSelectedTimezone } = timezoneSlice.actions;
export default timezoneSlice.reducer;
