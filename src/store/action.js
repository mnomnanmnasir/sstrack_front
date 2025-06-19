// userActions.js

import axios from 'axios';

// Action types
export const FETCH_USER_DATA_REQUEST = 'FETCH_USER_DATA_REQUEST';
export const FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS';
export const FETCH_USER_DATA_FAILURE = 'FETCH_USER_DATA_FAILURE';

// Action creators
export const fetchUserDataRequest = () => ({
    type: FETCH_USER_DATA_REQUEST,
});

export const fetchUserDataSuccess = (data) => ({
    type: FETCH_USER_DATA_SUCCESS,
    payload: data,
});

export const fetchUserDataFailure = (error) => ({
    type: FETCH_USER_DATA_FAILURE,
    payload: error,
});

// Async action to fetch user data
export const fetchUserData = (userType, headers) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    return async (dispatch) => {
        dispatch(fetchUserDataRequest());
        try {
            const response = await axios.get(`${apiUrl}/manager/dashboard`, {
                headers,
            });
            console.log('Response data:', response.data); // Log response data
            dispatch(fetchUserDataSuccess(response.data));
        } catch (error) {
            console.error('Error fetching user data:', error);
            dispatch(fetchUserDataFailure(error.message));
        }
    };
};
