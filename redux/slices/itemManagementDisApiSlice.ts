import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ItemDisApiSlice = createApi({
  reducerPath: 'ItemDisApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['ItemDis'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getItemDiss: builder.query({
      query: () => 'ItemDis/route',
      providesTags: ['ItemDis'],
    }),
    // Fetch a single category by ID
    getItemDisById: builder.query({
      query: (id) => `ItemDis/${id}`,
      providesTags: ['ItemDis'],
    }),
    getDeleteItemDiss: builder.query({
      query: () => 'ItemDis/bin',
      providesTags: ['ItemDis'],
    }),
    addItemDis: builder.mutation({
      query: (newItemDis) => ({
        url: 'ItemDis/route',
        method: 'POST',
        body: newItemDis,
      }),
      invalidatesTags: ['ItemDis'],
    }),
    updateItemDis: builder.mutation({
      query: (updatedItemDis) => ({
        url: `ItemDis/${updatedItemDis.id}`,
        method: 'PUT',
        body: updatedItemDis,
      }),
      invalidatesTags: ['ItemDis'],
    }),
    deleteItemDis: builder.mutation({
      query: (id) => ({
        url: `ItemDis/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetItemDissQuery,
  useGetItemDisByIdQuery, // New hook to fetch single category
  useGetDeleteItemDissQuery,
  useAddItemDisMutation,
  useUpdateItemDisMutation,
  useDeleteItemDisMutation,
} = ItemDisApiSlice;