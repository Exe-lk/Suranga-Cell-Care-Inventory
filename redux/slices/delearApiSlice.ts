import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dealerApiSlice = createApi({
  reducerPath: 'dealerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Dealer'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getDealers: builder.query({
      query: () => 'dealer/route',
      providesTags: ['Dealer'],
    }),
    // Fetch a single category by ID
    getDealerById: builder.query({
      query: (id) => `dealer/${id}`,
      providesTags: ['Dealer'],
    }),
    getDeleteDealers: builder.query({
      query: () => 'dealer/bin',
      providesTags: ['Dealer'],
    }),
    addDealer: builder.mutation({
      query: (newDealer) => ({
        url: 'dealer/route',
        method: 'POST',
        body: newDealer,
      }),
      invalidatesTags: ['Dealer'],
    }),
    updateDealer: builder.mutation({
      query: (updatedDealer) => ({
        url: `dealer/${updatedDealer.id}`,
        method: 'PUT',
        body: updatedDealer,
      }),
      invalidatesTags: ['Dealer'],
    }),
    deleteDealer: builder.mutation({
      query: (id) => ({
        url: `dealer/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDealersQuery,
  useGetDealerByIdQuery, // New hook to fetch single category
  useGetDeleteDealersQuery,
  useAddDealerMutation,
  useUpdateDealerMutation,
  useDeleteDealerMutation,
} = dealerApiSlice;
