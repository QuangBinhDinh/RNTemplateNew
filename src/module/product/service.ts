import { domainApi } from '@api/service';
const extendedDomain = domainApi.injectEndpoints({
    endpoints: build => ({
        fetchProductInfo: build.query<{ status: string; result: any }, number>({
            query: productId => ({ url: `mobile/product/view/${productId}` }),
            //transformResponse: response => response.result,
        }),
    }),
});

export const { useLazyFetchProductInfoQuery, useFetchProductInfoQuery } = extendedDomain;
