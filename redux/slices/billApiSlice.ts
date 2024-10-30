import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const billApiSlice = createApi({
  reducerPath: 'billApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Bill'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getBills: builder.query({
      query: () => 'bill/route',
      providesTags: ['Bill'],
    }),
    // Fetch a single category by ID
    getBillById: builder.query({
      query: (id) => `bill/${id}`,
      providesTags: ['Bill'],
    }),
    getDeleteBills: builder.query({
      query: () => 'bill/bin',
      providesTags: ['Bill'],
    }),
    addBill: builder.mutation({
      query: (newBill) => ({
        url: 'bill/route',
        method: 'POST',
        body: newBill,
      }),
      invalidatesTags: ['Bill'],
    }),
    updateBill: builder.mutation({
      query: (updatedBill) => ({
        url: `bill/${updatedBill.id}`,
        method: 'PUT',
        body: updatedBill,
      }),
      invalidatesTags: ['Bill'],
    }),
    deleteBill: builder.mutation({
      query: (id) => ({
        url: `bill/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetBillsQuery,
  useGetBillByIdQuery, // New hook to fetch single category
  useGetDeleteBillsQuery,
  useAddBillMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
} = billApiSlice;
