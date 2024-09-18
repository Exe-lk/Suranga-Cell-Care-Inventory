import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stockKeeperApiSlice = createApi({
  reducerPath: 'stockKeeperApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['StockKeeper'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getStockKeepers: builder.query({
      query: () => 'stockKeeper/route',
      providesTags: ['StockKeeper'], // Cache invalidation
    }),
    // Get a user by ID
    getStockKeeperById: builder.query({
      query: (id) => `stockKeeper/route/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'StockKeeper', id }], // Cache invalidation
    }),
    // Create: Add a new user
    addStockKeeper: builder.mutation({
      query: (newStockKeeper) => ({
        url: 'stockKeeper/route',
        method: 'POST',
        body: newStockKeeper,
      }),
      invalidatesTags: ['StockKeeper'],
    }),
    // Update: Update an existing user
    updateStockKeeper: builder.mutation({
      query: ({ id, ...updatedStockKeeper }) => ({
        url: `stockKeeper/route/${id}`,
        method: 'PUT',
        body: updatedStockKeeper,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'StockKeeper', id }],
    }),
    // Delete: Delete a user
    deleteStockKeeper: builder.mutation({
      query: (id) => ({
        url: `stockKeeper/route/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'StockKeeper', id }],
    }),
  }),
});

export const {
  useGetStockKeepersQuery,
  useGetStockKeeperByIdQuery,  // Export the hook for fetching by ID
  useAddStockKeeperMutation,
  useUpdateStockKeeperMutation,
  useDeleteStockKeeperMutation,
} = stockKeeperApiSlice;
