import { createSlice } from "@reduxjs/toolkit";

const timelineSlice = createSlice({
    name: "timeline",
    initialState: {
        timeline: [],
        filterUsers: [],
        userTimeline: [],
        showTimelineData: null,
        loading: false
    },
    reducers: {
        getTimeline: (state, { payload }) => {
            return {
                ...state,
                timeline: payload,
                filterUsers: payload
            }
        },
        searchUsers: (state, { payload }) => {
            return {
                ...state,
                timeline: state?.filterUsers?.filter((user) => {
                    const username = user?.userName?.toLowerCase()
                    const searchValue = payload?.toLowerCase()
                    return username.includes(searchValue)
                })
            }
        },
        selectUserTimeline: (state, { payload }) => {
            if (payload?.findTimeline?.formattedDate === payload.formattedDate) {
                return {
                    ...state,
                    showTimelineData: payload.findTimeline.data
                }
            }
            else {
                return {
                    ...state,
                    showTimelineData: payload.data,
                    userTimeline: [
                        ...state.userTimeline,
                        payload
                    ]
                }
            }
        },
        setLoading: (state, { payload }) => {
            return {
                ...state,
                loading: payload
            }
        },
        setLogout: (state, { payload }) => {
            return {
                timeline: [],
                filterUsers: [],
                userTimeline: [],
                showTimelineData: null,
                loading: false
            }
        }
    },
})

export const { getTimeline, setLoading, searchUsers, selectUserTimeline, setLogout } = timelineSlice.actions
export default timelineSlice.reducer