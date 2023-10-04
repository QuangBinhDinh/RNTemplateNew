import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DOMAIN_URL, API_URL } from '@env';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import {
    FetchArgs,
    FetchBaseQueryArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { isPlainObject } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: '' },
    ): BaseQueryFn<
        {
            url: string;
            method: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
            headers?: AxiosRequestConfig['headers'];
        },
        unknown,
        unknown
    > =>
    async ({ url, method, data, params, headers }) => {
        try {
            const result = await axios({
                url: baseUrl + url,
                method,
                data,
                params,
                headers,
            });
            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };
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
const anotherBaseQuerry =
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
    baseQuery: anotherBaseQuerry({
        baseUrl: API_URL,
        timeout: 15000,
        headers: {
            'User-Agent': `printervalApp/1.5`,
        },
    }),
    endpoints: build => ({}),
});
