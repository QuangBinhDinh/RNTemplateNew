import { BaseError } from '@api/axios';
import { Dispatch, createAsyncThunk } from '@reduxjs/toolkit';
import { createGetThunk, createPostThunk } from '@store/asyncThunk';
import { RootState } from '@store/store';
import { User } from '@type/common';
import axios from 'axios';

export interface LoginArgs {
    email: string;
    password: string;
    deviceId: string;
    fcm_token?: string;
    customerToken?: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

const userLogin = createPostThunk<unknown, LoginArgs, LoginResponse>(
    'auth/login',
    'user/stateless-sign-in',
    'domainApi',
    res => ({
        access_token: res.access_token,
        user: res.customer,
    }),
);

export { userLogin };

const obj = {
    email: 'test@printerval.com',
    password: '123456',
    deviceId: '8585f2885fc92dd2',
    fcm_token:
        'fHWndeQBTmeYrolB9H9HHy:APA91bF0iUckgXQTZSO9BTT2eGCDDyZLpK21HPPrfp2qub_NXeviCUiSvuVcb0An80rrx-jQC2shZpoun1IamICbc14fDY2JGP6aGuxV40BPpCX-sW5yIsfMBUb6Eclk_JVaUK0MbGiw',
    customerToken: '8585f2885fc92dd2-1717121847898',
};

const header = {
    'User-Agent': 'PrintervalApp/android/1.6.12',
    token: '3d2e2ab6dc4c08f1483120fe481822f1',
};
