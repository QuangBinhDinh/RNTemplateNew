import { api } from '@api/service';

const extendedApi = api.injectEndpoints({
    endpoints: build => ({
        fetchHomeBanner: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=slide', method: 'get' }),
        }),

        fetchPopularDesign: build.query<any, void>({
            query: () => ({ url: 'option?filters=key=design-box-popular-tags-data', method: 'get' }),
        }),
    }),
});

export const { useFetchHomeBannerQuery, useFetchPopularDesignQuery } = extendedApi;
