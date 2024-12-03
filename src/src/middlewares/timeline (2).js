import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getTimeline, selectUserTimeline, setLoading } from "../store/timelineSlice";
import { setTeam } from "../store/teamSlice";

export const GetAllTimelineUsersOwner = createAsyncThunk("get/timeline-users", async (body, { getState, dispatch }) => {
    console.log(body);
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/owner/getCompanyemployee`, {
            headers: body,
        })
        if (response.status) {
            dispatch(setLoading(false))
            const onlineUsers = response.data?.onlineUsers?.length > 0 ? response.data?.onlineUsers : []
            const offlineUsers = response.data?.offlineUsers?.length > 0 ? response.data?.offlineUsers : []
            const allUsers = [...onlineUsers, ...offlineUsers];
            dispatch(getTimeline(allUsers.filter((f) => f.isArchived === false && f.UserStatus === false)))
            console.log(response);
        }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error);
    }
})

export const GetTimelineUsersAdmin = createAsyncThunk("get/timeline-users", async (body, { getState, dispatch }) => {
    console.log(body);
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/superAdmin/allEmployeesworkinghour`, {
            headers: body,
        })
        if (response.status) {
            dispatch(setLoading(false))
            const onlineUsers = response.data?.onlineUsers?.length > 0 ? response.data?.onlineUsers : [];
            const offlineUsers = response.data?.offlineUsers?.length > 0 ? response.data?.offlineUsers : [];
            const allUsers = [...onlineUsers, ...offlineUsers];
            dispatch(getTimeline(allUsers.filter((f) => f.isArchived === false && f.UserStatus === false)))
        }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error);
    }
})

export const GetTimelineUserOwner = createAsyncThunk("get/timeline-users", async (body, { getState, dispatch }) => {
    const { userId, formattedDate, headers } = body
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/owner/sorted-datebased/${userId}?date=${encodeURIComponent(formattedDate)}`, {
            headers: headers,
        })
        if (response.status) {
            dispatch(setLoading(false))
            dispatch(selectUserTimeline({ ...response.data, formattedDate }))
        }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error);
    }
})

export const GetTimelineUserSuperAdmin = createAsyncThunk("get/timeline-users", async (body, { getState, dispatch }) => {
    const { userId, formattedDate, headers } = body
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/superAdmin/sorted-datebased/${userId}?date=${encodeURIComponent(formattedDate)}`, {
            headers: headers,
        })
        if (response.status) {
            dispatch(setLoading(false))
            dispatch(selectUserTimeline({ ...response.data, formattedDate }))
        }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error);
    }
})

export const GetOwnerTeam = createAsyncThunk("get/team-users", async (body, { getState, dispatch }) => {
    const { headers, user } = body
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`https://myuniversallanguages.com:9093/api/v1/owner/companies`, {
            headers: headers,
        })
        if (response.status) {
            const filterCompanies = response?.data?.employees?.filter((employess, index) => {
                return user.company === employess.company && employess.userType !== "owner"
            })
            dispatch(setTeam(filterCompanies))
        }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error);
    }
})