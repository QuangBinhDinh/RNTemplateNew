import { Dispatch, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { API_URL } from '@env';
import axios from 'axios';
import { ERROR_CODE } from '@api/constant';
import { getErrorMessage } from '@api/base';
import { BaseError, api, domainApi } from '@api/axios';
import { showLoading } from '@components/loading/LoadingSpinner';

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
    transformResponse: (res: BaseResponse) => Response | Partial<BaseResponse> = res => res,
    domain: 'api' | 'domainApi' = 'api',
    header: { [x: string]: any } = {},
) => {
    return createAsyncThunk<Response | Partial<BaseResponse>, Params, AsyncThunkConfig>(
        type,
        async (params, { getState, rejectWithValue }) => {
            const token = getState().auth.accessToken;
            const headers = { ...header, ...(!!token && { token }) };
            const service = domain == 'api' ? api : domainApi;

            //log something before request
            try {
                const { data } = await service.get(url, { params, headers });
                //log some data arrival here
                if (data.status == 'successful') {
                    return transformResponse(data);
                }
                return rejectWithValue({
                    error_code: ERROR_CODE.SERVER_ERR,
                    error_msg: getErrorMessage(data),
                });
            } catch (e) {
                //log some error if happened
                return rejectWithValue(e as BaseError);
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

            showLoading(true);
            try {
                const { data } = await service.post(url, body, { params, headers });
                showLoading(false);
                if (data.status == 'successful') return transformResponse(data);
                return rejectWithValue({
                    error_code: ERROR_CODE.SERVER_ERR,
                    error_msg: getErrorMessage(data),
                });
            } catch (e) {
                showLoading(false);
                return rejectWithValue(e as BaseError);
            }
        },
    );
};

export { createPostThunk, createGetThunk };
