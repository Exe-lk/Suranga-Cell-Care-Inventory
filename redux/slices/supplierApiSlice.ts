import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const supplierApiSlice = createApi({
  reducerPath: 'supplierApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Supplier'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getSuppliers: builder.query({
      query: () => 'supplier/route',
      providesTags: ['Supplier'],
    }),
    // Fetch a single category by ID
    getSupplierById: builder.query({
      query: (id) => `supplier/${id}`,
      providesTags: ['Supplier'],
    }),
    getDeleteSuppliers: builder.query({
      query: () => 'supplier/bin',
      providesTags: ['Supplier'],
    }),
    addSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: 'supplier/route',
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation({
      query: (updatedSupplier) => ({
        url: `supplier/${updatedSupplier.id}`,
        method: 'PUT',
        body: updatedSupplier,
      }),
      invalidatesTags: ['Supplier'],
    }),
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `supplier/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery, // New hook to fetch single category
  useGetDeleteSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApiSlice;
