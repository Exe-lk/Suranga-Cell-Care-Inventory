import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApiSlice = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Read: Fetch all user
    getUsers: builder.query({
      query: () => 'user/route',
      providesTags: ['User'], // The endpoint to fetch all user
    }),
    // Create: Add a new user
    addUser: builder.mutation({
      query: (newUser) => ({
        url: 'user/route',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
} = userApiSlice;
