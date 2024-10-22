import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const brandApiSlice = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({ baseUrl:'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Brand'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getBrands: builder.query({
      query: () => 'brand/route',
      providesTags: ['Brand'], 
    }),
    // Get a user by ID
    getBrandById: builder.query({
      query: (id) => `brand/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'Brand', id }], // Cache invalidation
    }),
    getDeleteBrands: builder.query({
      query: () => 'brand/bin',
      providesTags: ['Brand'],
    }),
    // Create: Add a new user
    addBrand: builder.mutation({
      query: (newBrand) => ({
        url: 'brand/route',
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['Brand'],
    }),
    // Update: Update an existing user
    updateBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: `brand/${id}`,
        method: 'PUT',
        body: updatedBrand,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Brand', id }],
    }),
    // Delete: Delete a user
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `brand/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useGetDeleteBrandsQuery,  // Export the hook for fetching by ID
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApiSlice;
