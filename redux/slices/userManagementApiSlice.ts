import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userManagementApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getUsers: builder.query({
      query: () => 'User_management/route',
      providesTags: ['User'], 
    }),
    // Get a user by ID
    getUserById: builder.query({
      query: (id) => `User_management/${id}`, // Call endpoint with ID
      providesTags: (result, error, id) => [{ type: 'User', id }], // Cache invalidation
    }),
    getDeleteUsers: builder.query({
      query: () => 'User_management/bin',
      providesTags: ['User'],
    }),
    // Create: Add a new user
    addUser: builder.mutation({
      query: (newUser) => ({
        url: 'User_management/route',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    // Update: Update an existing user
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `User_management/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    // Delete: Delete a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `User_management/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetDeleteUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userManagementApiSlice;
