// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userManagementApiSlice } from './slices/userManagementApiSlice';
import { userApiSlice } from './slices/userApiSlice';

const store = configureStore({
  reducer: {
    [userManagementApiSlice.reducerPath]: userManagementApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer, // Both now have unique reducerPaths
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userManagementApiSlice.middleware, userApiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
