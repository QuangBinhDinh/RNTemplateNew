import { createApi } from '@reduxjs/toolkit/query/react';
import { DOMAIN_URL } from '@env';
import { axiosBaseQuery, APP_USER_AGENT } from '@api/base';

export const domainApi = createApi({
    reducerPath: 'domainApi',
    baseQuery: axiosBaseQuery({
        baseUrl: DOMAIN_URL,
        timeout: 20000,
        headers: {
            'User-Agent': APP_USER_AGENT,
        },
    }),
    endpoints: build => ({
        postImage: build.mutation<{ status: string; upload: string[] }, any>({
            query: args => {
                var body = new FormData();
                body.append('upload', args);
                body.append('type', 'default');

                return {
                    url: 'printerval-central/upload',
                    method: 'post',
                    header: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body,
                };
            },
        }),
    }),
    tagTypes: ['Address', 'SearchResult', 'ProductResult', 'Cart'],
});
