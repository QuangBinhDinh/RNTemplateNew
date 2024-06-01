import { createSlice } from '@reduxjs/toolkit';
import { User } from '@type/common';
import { userLogin } from './service';

interface Auth {
    token: string | null;
    userInfo: User | null;
    logged: boolean;
    accessToken: string | null;
    error_msg: string;
    isLogging: boolean;
}

const initialState: Auth = {
    token: null,
    userInfo: null,
    logged: false,
    accessToken: null,
    error_msg: '',
    isLogging: false,
};

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: builder => {
        builder.addCase(userLogin.pending, state => {
            state.error_msg = '';
            state.isLogging = true;
        });
        builder.addCase(userLogin.fulfilled, (state, action) => {
            const { access_token, user } = action.payload;
            state.isLogging = false;
            state.accessToken = access_token;
            state.userInfo = user;
            state.logged = true;
        });
        builder.addCase(userLogin.rejected, (state, action) => {
            console.log('failed');
            state.error_msg = action.payload?.error_msg ?? '';
            state.isLogging = false;
        });
    },
});

export default auth;
