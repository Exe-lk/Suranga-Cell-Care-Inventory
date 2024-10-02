import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApiSlice = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getCategories: builder.query({
      query: () => 'category/route',
      providesTags: ['Category'], 
    }),
    // Get a user by ID
    getCategoryById: builder.query({
      query: (id) => `category/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'Category', id }], // Cache invalidation
    }),
    getDeleteCategories: builder.query({
      query: () => 'category/bin',
      providesTags: ['Category'],
    }),
    // Create: Add a new user
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: 'category/route',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    // Update: Update an existing user
    updateCategory: builder.mutation({
      query: ({ id, ...updatedCategory }) => ({
        url: `category/${id}`,
        method: 'PUT',
        body: updatedCategory,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),
    // Delete: Delete a user
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetDeleteCategoriesQuery,  // Export the hook for fetching by ID
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
