import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const brand1ApiSlice = createApi({
  reducerPath: 'brand1Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Brand1'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getBrands1: builder.query({
      query: () => 'brand1/route',
      providesTags: ['Brand1'], 
    }),
    // Get a user by ID
    getBrand1ById: builder.query({
      query: (id) => `brand1/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'Brand1', id }], // Cache invalidation
    }),
    getDeleteBrands1: builder.query({
      query: () => 'brand1/bin',
      providesTags: ['Brand1'],
    }),
    // Create: Add a new user
    addBrand1: builder.mutation({
      query: (newBrand1) => ({
        url: 'brand1/route',
        method: 'POST',
        body: newBrand1,
      }),
      invalidatesTags: ['Brand1'],
    }),
    // Update: Update an existing user
    updateBrand1: builder.mutation({
      query: ({ id, ...updatedBrand1 }) => ({
        url: `brand1/${id}`,
        method: 'PUT',
        body: updatedBrand1,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand1', id }],
    }),
    // Delete: Delete a user
    deleteBrand1: builder.mutation({
      query: (id) => ({
        url: `brand1/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Brand1', id }],
    }),
  }),
});

export const {
  useGetBrands1Query,
  useGetBrand1ByIdQuery,
  useGetDeleteBrands1Query,  // Export the hook for fetching by ID
  useAddBrand1Mutation,
  useUpdateBrand1Mutation,
  useDeleteBrand1Mutation,
} = brand1ApiSlice;
