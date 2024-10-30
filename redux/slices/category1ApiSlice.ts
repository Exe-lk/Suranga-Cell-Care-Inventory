import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const category1ApiSlice = createApi({
  reducerPath: 'category1Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Category1'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getCategories1: builder.query({
      query: () => 'category1/route',
      providesTags: ['Category1'], 
    }),
    // Get a user by ID
    getCategory1ById: builder.query({
      query: (id) => `category1/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'Category1', id }], // Cache invalidation
    }),
    getDeleteCategories1: builder.query({
      query: () => 'category1/bin',
      providesTags: ['Category1'],
    }),
    // Create: Add a new user
    addCategory1: builder.mutation({
      query: (newCategory1) => ({
        url: 'category1/route',
        method: 'POST',
        body: newCategory1,
      }),
      invalidatesTags: ['Category1'],
    }),
    // Update: Update an existing user
    updateCategory1: builder.mutation({
      query: ({ id, ...updatedCategory1 }) => ({
        url: `category1/${id}`,
        method: 'PUT',
        body: updatedCategory1,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category1', id }],
    }),
    // Delete: Delete a user
    deleteCategory1: builder.mutation({
      query: (id) => ({
        url: `category1/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category1', id }],
    }),
  }),
});

export const {
  useGetCategories1Query,
  useGetCategory1ByIdQuery,
  useGetDeleteCategories1Query,  // Export the hook for fetching by ID
  useAddCategory1Mutation,
  useUpdateCategory1Mutation,
  useDeleteCategory1Mutation,
} = category1ApiSlice;
