// userReducer.js

import {
    FETCH_USER_DATA_REQUEST,
    FETCH_USER_DATA_SUCCESS,
    FETCH_USER_DATA_FAILURE,
} from '../store/action';

const initialState = {
    loading: false,
    data: null,
    error: '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_DATA_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_USER_DATA_SUCCESS:
            return {
                loading: false,
                data: action.payload,
                error: '',
            };
        case FETCH_USER_DATA_FAILURE:
            return {
                loading: false,
                data: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
