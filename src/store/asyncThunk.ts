import { Dispatch, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { API_URL, DOMAIN_URL } from '@env';
import { ERROR_CODE, SERVICE_DEBUG } from '@api/constant';
import { getErrorMessage } from '@api/base';
import { BaseError, api, domainApi } from '@api/axios';
import { createSignal, removeSignal } from '@api/axios/abort';

type AsyncThunkConfig = {
    /** return type for `thunkApi.getState` */
    state: RootState;
    /** type for `thunkApi.dispatch` */
    dispatch?: Dispatch;
    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra?: unknown;
    /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
    rejectValue: BaseError;
    /** return type of the `serializeError` option callback */
    serializedErrorType?: unknown;
    /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
    pendingMeta?: unknown;
    /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
    fulfilledMeta?: unknown;
    /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
    rejectedMeta?: unknown;
};

type BaseResponse = {
    status: string;
    [x: string]: any;
};

/**
 *  Arg type for createPostThunk
 */
type PostData<TParam, TBody> = {
    params?: TParam;
    body?: TBody;
};

/**
 * Async thunk for GET request
 * @param type Action name of this thunk
 * @param url The suffix url of the request
 * @param domain
 * @param transformResponse Selector of BaseResponse, only retrieve some useful value
 * @param header Additonal header for the request
 * @returns
 */
const createGetThunk = <Params, Response = unknown>(
    type: string,
    url: string,
    domain: 'api' | 'domainApi' = 'api',
    transformResponse: (res: BaseResponse) => Response | Partial<BaseResponse> = res => res,
    header: { [x: string]: any } = {},
) => {
    return createAsyncThunk<Response | Partial<BaseResponse>, Params, AsyncThunkConfig>(
        type,
        async (params, { getState, rejectWithValue }) => {
            const token = getState().auth.accessToken;
            const headers = { ...header, ...(!!token && { token }) };
            const service = domain == 'api' ? api : domainApi;

            const signal_name = `${type}_${Date.now}`;
            const signal = createSignal(signal_name);
            thunkLogger(type, {
                url: `${domain == 'api' ? API_URL : DOMAIN_URL}${url}`,
                params,
                headers,
            });
            try {
                const res = await service.get(url, { params, headers, signal });
                thunkLogger(type, res, 'response');
                removeSignal(signal_name);
                if (res.data.status == 'successful') {
                    return transformResponse(res.data);
                }
                return rejectWithValue({
                    error_code: ERROR_CODE.SERVER_ERR,
                    error_msg: getErrorMessage(res.data),
                });
            } catch (e) {
                var error = e as BaseError;
                thunkLogger(type, error, 'error');
                removeSignal(signal_name);
                return rejectWithValue(error);
            }
        },
    );
};

/**
 * Async thunk for POST request
 * @param type Action name of this thunk
 * @param url The suffix url of the request
 * @param domain
 * @param transformResponse Selector of BaseResponse, only retrieve some useful value
 * @param header Additonal header for the request
 * @returns
 */
const createPostThunk = <TParam, TBody, Response = unknown>(
    type: string,
    url: string,
    domain: 'api' | 'domainApi' = 'api',
    transformResponse: (res: BaseResponse) => Response | Partial<BaseResponse> = res => res,
    header: { [x: string]: any } = {},
) => {
    return createAsyncThunk<Response | Partial<BaseResponse>, PostData<TParam, TBody>, AsyncThunkConfig>(
        type,
        async (postData, { getState, rejectWithValue }) => {
            const { params, body } = postData;
            const token = getState().auth.accessToken;
            const headers = { ...header, ...(!!token && { token }) };
            const service = domain == 'api' ? api : domainApi;

            const signal_name = `${type}_${Date.now}`;
            const signal = createSignal(signal_name);
            thunkLogger(type, {
                url: `${domain == 'api' ? API_URL : DOMAIN_URL}${url}`,
                params,
                headers,
                body,
            });

            try {
                const res = await service.post(url, body, { params, headers, signal });
                thunkLogger(type, res, 'response');
                removeSignal(signal_name);

                if (res.data.status == 'successful') return transformResponse(res.data);
                return rejectWithValue({
                    error_code: ERROR_CODE.SERVER_ERR,
                    error_msg: getErrorMessage(res.data),
                });
            } catch (e) {
                var error = e as BaseError;
                thunkLogger(type, error, 'error');
                removeSignal(signal_name);
                return rejectWithValue(error);
            }
        },
    );
};

/**
 * Only logging if action name is specified in SERVICE_DEBUG array
 * @param action_name
 * @param log
 * @param type
 */
const thunkLogger = (action_name: string, log: any, type: 'request' | 'response' | 'error' = 'request') => {
    if (!!SERVICE_DEBUG.find(item => action_name.includes(item))) {
        console.group(`${type.toUpperCase()}:`, action_name);
        console.log(log);
        console.groupEnd();
        //other logging 3rd party go here
    }
};

export { createPostThunk, createGetThunk };
