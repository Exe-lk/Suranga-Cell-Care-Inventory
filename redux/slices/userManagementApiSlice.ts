import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userManagementApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Read: Fetch all user
    getUsers: builder.query({
      query: () => 'User_management/route',
      providesTags: ['User'], // The endpoint to fetch all user
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
    // Update: Update an existing category
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `User_management/route/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
    }),
    // Delete: Delete a category
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `User_management/route/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userManagementApiSlice;
