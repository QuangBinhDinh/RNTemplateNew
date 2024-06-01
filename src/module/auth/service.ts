import { createGetThunk, createPostThunk } from '@store/asyncThunk';
import { User } from '@type/common';

export interface LoginArgs {
    email: string;
    password: string;
    deviceId: string;
    fcm_token?: string;
    customerToken?: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface ProductFilterArgs {
    id: string | number;
    category_id: string | number;
    category_slug: string;
    q: string;
    tag_id: number;
    page_size: number;
    page_id: number;
    minPrice: string | number;
    maxPrice: string | number;
    order: string;
    color_variant_id: number;
    size_variant_id: number;
    type_variant_id: number;
    user_id: number;
    event_id: number;
}

export interface ProductResultResponse {
    result: any[];
    categories: any[];
}

const userLogin = createPostThunk<unknown, LoginArgs, LoginResponse>(
    'auth/login',
    'user/stateless-sign-in',
    'domainApi',
    res => ({
        access_token: res.access_token,
        user: res.customer,
    }),
);

const getProductsFilterBy = createGetThunk<Partial<ProductFilterArgs>, ProductResultResponse>(
    'products/filter',
    'mobile/product/category-filter',
    'domainApi',
    res => ({
        result: res.result,
        categories: res.categories,
    }),
);

export { userLogin, getProductsFilterBy };
