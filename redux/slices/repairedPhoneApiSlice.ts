import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const repairedPhoneApiSlice = createApi({
  reducerPath: 'repairedPhoneApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['repairedPhone'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getrepairedPhones: builder.query({
      query: () => 'repairedPhone/route',
      providesTags: ['repairedPhone'],
    }),
    // Fetch a single category by ID
    getrepairedPhoneById: builder.query({
      query: (id) => `repairedPhone/${id}`,
      providesTags: ['repairedPhone'],
    }),
    updaterepairedPhone: builder.mutation({
      query: (updatedrepairedPhone) => ({
        url: `repairedPhone/${updatedrepairedPhone.id}`,
        method: 'PUT',
        body: updatedrepairedPhone,
      }),
      invalidatesTags: ['repairedPhone'],
    }),
    }),
  });


export const {
  useGetrepairedPhonesQuery,
  useGetrepairedPhoneByIdQuery, // New hook to fetch single category
  useUpdaterepairedPhoneMutation,
} = repairedPhoneApiSlice;
