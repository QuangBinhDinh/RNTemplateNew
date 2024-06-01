import axios, { AxiosError } from 'axios';
import { API_URL, DOMAIN_URL, API_TEST, DOMAIN_TEST } from '@env';
import { getVersion } from 'react-native-device-info';
import { ERROR_CODE } from './constant';

export type BaseError = {
    error_code: number;
    error_msg: string;
};

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'User-Agent': `printervalApp/${getVersion()}`,
    },
});
//handle truoc request
api.interceptors.request.use(async config => {
    // config.cancelToken = cancelTokenSource.token; //it will update cancelToken on every call
    return config;
});

//handle sau request
api.interceptors.response.use(
    async response => {
        //console.log(response);
        return response;
    },
    async axiosError => {
        return Promise.reject(buildErrorCode(axiosError));
    },
);

const domainApi = axios.create({
    baseURL: DOMAIN_URL,
    timeout: 30000,
    headers: {
        'User-Agent': `printervalApp/${getVersion()}`,
    },
});
//handle truoc request
domainApi.interceptors.request.use(async config => {
    // config.cancelToken = cancelTokenSource.token; //it will update cancelToken on every call
    return config;
});

//handle sau request
domainApi.interceptors.response.use(
    async response => {
        //console.log(response);
        return response;
    },
    async axiosError => {
        return Promise.reject(buildErrorCode(axiosError));
    },
);

export const buildErrorCode = (axiosError: any): BaseError => {
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
    return {
        error_code: code,
        error_msg: message,
    };
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

export { api, domainApi };
