import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
    name: "timeline",
    initialState: {
        team: [],
        loading: false
    },
    reducers: {
        setTeam: (state, { payload }) => {
            return {
                ...state,
                timeline: payload,
            }
        },
        setLoading: (state, { payload }) => {
            return {
                ...state,
                loading: payload
            }
        },
    },
})

export const { setTeam, setLoading } = teamSlice.actions
export default teamSlice.reducer