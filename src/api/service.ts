import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@env';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { RootState } from '@store/store';

interface BaseQueryArgs {
    baseUrl: string;
    timeout?: number;
    headers?: AxiosRequestConfig['headers'];
}
interface QueryArgs {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    header?: AxiosRequestConfig['headers'];
}
const axiosBaseQuery =
    (args: BaseQueryArgs): BaseQueryFn<QueryArgs, unknown, unknown> =>
    async (queryArg, api) => {
        const { baseUrl, timeout, headers } = args;
        const { url, method, data, params, header } = queryArg;
        const { getState } = api;

        var newHeader: AxiosRequestConfig['headers'] = headers ?? {};
        var token = (getState() as RootState).auth.token;
        if (token) newHeader['token'] = token;
        if (header) newHeader = Object.assign(newHeader, header);

        try {
            const res = await axios({
                url: baseUrl + url,
                method,
                data,
                params,
                headers: newHeader,
                timeout,
            });
            console.log(res);
            if (res.data.status == 'successful') return { data: res.data };
            else
                return {
                    error: {
                        status: 'ServerErr',
                        message: res.data.message ?? JSON.stringify(res.data),
                    },
                };
        } catch (axiosError) {
            let err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    message: err.response?.data || err.message,
                },
            };
        }
    };

export const api = createApi({
    baseQuery: axiosBaseQuery({
        baseUrl: API_URL,
        timeout: 15000,
        headers: {
            'User-Agent': `printervalApp/1.5`,
        },
    }),
    endpoints: build => ({}),
});
