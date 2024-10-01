import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const model1ApiSlice = createApi({
  reducerPath: 'model1Api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Model1'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getModels1: builder.query({
      query: () => 'model1/route',
      providesTags: ['Model1'], 
    }),
    // Get a user by ID
    getModel1ById: builder.query({
      query: (id) => `model1/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'Model1', id }], // Cache invalidation
    }),
    getDeleteModels1: builder.query({
      query: () => 'model1/bin',
      providesTags: ['Model1'],
    }),
    // Create: Add a new user
    addModel1: builder.mutation({
      query: (newModel1) => ({
        url: 'model1/route',
        method: 'POST',
        body: newModel1,
      }),
      invalidatesTags: ['Model1'],
    }),
    // Update: Update an existing user
    updateModel1: builder.mutation({
      query: ({ id, ...updatedModel1 }) => ({
        url: `model1/${id}`,
        method: 'PUT',
        body: updatedModel1,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Model1', id }],
    }),
    // Delete: Delete a user
    deleteModel1: builder.mutation({
      query: (id) => ({
        url: `model1/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Model1', id }],
    }),
  }),
});

export const {
  useGetModels1Query,
  useGetModel1ByIdQuery,
  useGetDeleteModels1Query,  // Export the hook for fetching by ID
  useAddModel1Mutation,
  useUpdateModel1Mutation,
  useDeleteModel1Mutation,
} = model1ApiSlice;
