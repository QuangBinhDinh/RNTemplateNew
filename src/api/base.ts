import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { RootState } from '@store/store';
import { ERROR_CODE, SERVICE_DEBUG } from './constant';
import { Platform } from 'react-native';
import { getVersion } from 'react-native-device-info';
import qs from 'query-string';

interface BaseQueryArgs {
    baseUrl: string;
    timeout?: number;
    headers?: AxiosRequestConfig['headers'];
}
interface QueryArgs {
    url: string;
    method?: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    header?: AxiosRequestConfig['headers'];
}

export const APP_USER_AGENT = `PrintervalApp/${Platform.OS}/${getVersion()}`;

export const axiosBaseQuery =
    (args: BaseQueryArgs): BaseQueryFn<QueryArgs, any, { code: string | number; message: string }> =>
    async (queryArg, api) => {
        const { baseUrl, timeout, headers } = args;
        const { url, method, body, params, header } = queryArg;
        const { getState, endpoint } = api;

        var newHeader: AxiosRequestConfig['headers'] = headers ?? {};
        var token = '';
        if (token) newHeader['token'] = token;
        if (header) newHeader = Object.assign(newHeader, header);

        if (SERVICE_DEBUG.includes(endpoint)) {
            console.group('REQUEST: ' + endpoint);
            console.log({
                url: baseUrl + url + '?' + qs.stringify(params),
                params,
                header: newHeader,
                body,
            });
            console.groupEnd();
        }
        try {
            const res = await axios({
                url: baseUrl + url,
                method: endpoint.includes('fetch') ? 'get' : method,
                data: body,
                params,
                headers: newHeader,
                timeout,
            });

            if (SERVICE_DEBUG.includes(endpoint)) {
                console.group('RESPONSE: ' + endpoint);
                console.log(res);
                console.groupEnd();
            }
            if (res.data.status == 'successful') return { data: res.data };
            else {
                return {
                    error: {
                        code: ERROR_CODE.SERVER_ERR,
                        message: getErrorMessage(res.data),
                    },
                };
            }
        } catch (axiosError) {
            let err = axiosError as AxiosError;
            console.info('Axios Error', err);

            let code = 0;
            let message = '';

            if (err.response?.status) {
                code = err.response.status;
                if (err.response?.data) {
                    message = getErrorMessage(err.response.data);
                } else message = err.message;
            } else {
                message = err.message;
                if (message.includes('DOCTYPE html')) {
                    message = 'Unknown error occurred';
                }
                if (err.message.includes('Network Error')) code = ERROR_CODE.NO_NETWORK;
                else if (err.message.includes('timeout')) code = ERROR_CODE.TIME_OUT;
            }
            // console.log('Code: ' + code + '; Error message: ' + message);
            return {
                error: {
                    code,
                    message,
                },
            };
        }
    };

/**
 * Handle error response của Printerval, trả về 1 message duy nhất
 *
 * Có thể còn nhiều case khác nữa
 * @param err
 * @returns
 */
export const getErrorMessage = (err: any) => {
    let errMsg = 'Unknown error';

    var message = err?.message;
    var messages = err?.messages;
    if (!!message) {
        if (Array.isArray(message) && message.length > 0) {
            errMsg = JSON.stringify(message[0]);
        } else if (typeof message == 'object') {
            var valueList = Object.values(message);
            if (valueList.length > 0) {
                errMsg = JSON.stringify(valueList[0]);
            }
        } else if (typeof message == 'string') {
            errMsg = message;
        }
    } else if (!!messages) {
        if (Array.isArray(messages) && messages.length > 0) {
            errMsg = messages[0]?.text || 'Unknown error';
        }
    } else errMsg = JSON.stringify(err);
    return errMsg.slice(0, 150);
};
