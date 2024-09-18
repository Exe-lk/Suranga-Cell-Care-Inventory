// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userManagementApiSlice } from './slices/userManagementApiSlice';
import { userApiSlice } from './slices/userApiSlice';
import { brandApiSlice } from './slices/brandApiSlice';
import { categoryApiSlice } from './slices/categoryApiSlice';
import { modelApiSlice } from './slices/modelApiSlice';
import { stockKeeperApiSlice } from './slices/stockKeeperApiSlice';

const store = configureStore({
  reducer: {
    [userManagementApiSlice.reducerPath]: userManagementApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer, 
    [brandApiSlice.reducerPath]: brandApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [modelApiSlice.reducerPath]: modelApiSlice.reducer,
    [stockKeeperApiSlice.reducerPath]: stockKeeperApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userManagementApiSlice.middleware, userApiSlice.middleware, brandApiSlice.middleware, categoryApiSlice.middleware , modelApiSlice.middleware , stockKeeperApiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
