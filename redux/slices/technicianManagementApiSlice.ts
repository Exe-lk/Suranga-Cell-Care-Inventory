import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const technicianApiSlice = createApi({
  reducerPath: 'technicianApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://suranga-cellcare-inventory.netlify.app/api/' }),
  tagTypes: ['Technician'],
  endpoints: (builder) => ({
    // Read: Fetch all categories
    getTechnicians: builder.query({
      query: () => 'technicianManagement/route',
      providesTags: ['Technician'],
    }),
    // Fetch a single category by ID
    getTechnicianById: builder.query({
      query: (id) => `technicianManagement/${id}`,
      providesTags: ['Technician'],
    }),
    getDeleteTechnicians: builder.query({
      query: () => 'technicianManagement/bin',
      providesTags: ['Technician'],
    }),
    addTechnician: builder.mutation({
      query: (newTechnician) => ({
        url: 'technicianManagement/route',
        method: 'POST',
        body: newTechnician,
      }),
      invalidatesTags: ['Technician'],
    }),
    updateTechnician: builder.mutation({
      query: (updatedTechnician) => ({
        url: `technicianManagement/${updatedTechnician.id}`,
        method: 'PUT',
        body: updatedTechnician,
      }),
      invalidatesTags: ['Technician'],
    }),
    deleteTechnician: builder.mutation({
      query: (id) => ({
        url: `technicianManagement/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTechniciansQuery,
  useGetTechnicianByIdQuery, // New hook to fetch single category
  useGetDeleteTechniciansQuery,
  useAddTechnicianMutation,
  useUpdateTechnicianMutation,
  useDeleteTechnicianMutation,
} = technicianApiSlice;
