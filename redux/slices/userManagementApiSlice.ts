import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userManagementApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Read: Fetch all users
    getUsers: builder.query({
      query: () => 'user_management/route',
      providesTags: ['User'], 
    }),
    // Get a user by ID
    getUserById: builder.query({
      query: (id) => `user_management/${id}`, 
      providesTags: ['User'],
    }),
    getDeleteUsers: builder.query({
      query: () => 'user_management/bin',
      providesTags: ['User'],
    }),
    // Create: Add a new user
    addUser: builder.mutation({
      query: (newUser) => ({
        url: 'user_management/route',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    // Update: Update an existing user
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `user_management/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: ['User'],
    }),    
    // Delete: Delete a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user_management/${id}`,
        method: 'DELETE',
      }),
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
