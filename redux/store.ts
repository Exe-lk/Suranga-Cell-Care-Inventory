// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userManagementApiSlice } from './slices/userManagementApiSlice'; // Adjust the path accordingly

const store = configureStore({
  reducer: {
    [userManagementApiSlice.reducerPath]: userManagementApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userManagementApiSlice.middleware),
});

setupListeners(store.dispatch);

export default store;
