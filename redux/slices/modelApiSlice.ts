import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const modelApiSlice = createApi({
  reducerPath: 'modelApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Model'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getModels: builder.query({
      query: () => 'model/route',
      providesTags: ['Model'], 
    }),
    // Get a user by ID
    getModelById: builder.query({
      query: (id) => `model/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'Model', id }], // Cache invalidation
    }),
    getDeleteModels: builder.query({
      query: () => 'model/bin',
      providesTags: ['Model'],
    }),
    // Create: Add a new user
    addModel: builder.mutation({
      query: (newModel) => ({
        url: 'model/route',
        method: 'POST',
        body: newModel,
      }),
      invalidatesTags: ['Model'],
    }),
    // Update: Update an existing user
    updateModel: builder.mutation({
      query: ({ id, ...updatedModel }) => ({
        url: `model/${id}`,
        method: 'PUT',
        body: updatedModel,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Model', id }],
    }),
    // Delete: Delete a user
    deleteModel: builder.mutation({
      query: (id) => ({
        url: `model/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Model', id }],
    }),
  }),
});

export const {
  useGetModelsQuery,
  useGetModelByIdQuery,
  useGetDeleteModelsQuery,  // Export the hook for fetching by ID
  useAddModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = modelApiSlice;
