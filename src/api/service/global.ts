import { createApi } from '@reduxjs/toolkit/query/react';
import { APP_USER_AGENT, axiosBaseQuery } from '@api/base';

const GLOBAL_URL = 'https://glob.api.printerval.com/';

export const globalApi = createApi({
    reducerPath: 'globalApi',
    baseQuery: axiosBaseQuery({
        baseUrl: GLOBAL_URL,
        timeout: 20000,
        headers: {
            'User-Agent': APP_USER_AGENT,
        },
    }),
    endpoints: build => ({
        fetchSizeGuide: build.query<any[], { productId: number; type: string }>({
            query: ({ productId, type }) => ({ url: `size-guide/customer-size-guide/${productId}?type=${type}` }),
            transformResponse: res => res.result.list_size_guides.map((i: any) => ({ ...i, value: i.title })),
        }),
    }),
});
