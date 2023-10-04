import { combineReducers } from '@reduxjs/toolkit';
import auth from '../moudle/auth/reducer';
import search from '../moudle/home/reducer';
import { api } from '@api/service';

export const rootReducer = combineReducers({
    auth: auth.reducer,
    search: search.reducer,
    [api.reducerPath]: api.reducer,
});
