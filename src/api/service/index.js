import { api } from './api';
import { domainApi } from './domain';
import { globalApi } from './global';

const {
    useLazyFetchSlugQuery,
    useLazyFetchPaymentConfigQuery,
    useLazyFetchCountriesQuery,
    useLazyFetchCategorySlugQuery,
} = api;

const { usePostImageMutation } = domainApi;
const { useFetchSizeGuideQuery } = globalApi;

export {
    api,
    domainApi,
    globalApi,
    useLazyFetchSlugQuery,
    useLazyFetchPaymentConfigQuery,
    useLazyFetchCountriesQuery,
    useLazyFetchCategorySlugQuery,
    usePostImageMutation,
    useFetchSizeGuideQuery,
};
