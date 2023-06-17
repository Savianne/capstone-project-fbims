import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3009/app/api' }),
  tagTypes: ['ADDED_NEW_RECORD', 'DELETED_NEW_RECORD'],
  endpoints: (builder) => ({
    getAdminInfo: builder.query({
      query: () => ({
        url: '/get-admin-info',
        method: 'POST'
      }),
    }),
    getRecordCount: builder.query({
      query: (container) => ({
        url: `/get-records-count/${container}`,
        method: 'POST'
      }),
      providesTags: ["ADDED_NEW_RECORD", 'DELETED_NEW_RECORD']
    }),
    getMembersList: builder.mutation({
      query: (payload: {
        sorting: "A-Z" | "Z-A",  
        page: number,
        limit: number
      }) => ({
        url: `/get-members-list`,
        method: 'POST',
        body: payload
      }),
    }),
    addMemberRecord: builder.mutation({
      query: (memberData) => ({
        url: '/add-member-record',
        method: 'POST',
        body: memberData
      }),
      invalidatesTags: ['ADDED_NEW_RECORD']
    }),
    deleteMemberRecord: builder.mutation({
      query: (memberUID) => ({
        url: '/delete-member-record',
        method: 'DELETE',
        body: {memberUID}
      }),
      invalidatesTags: ['DELETED_NEW_RECORD']
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetAdminInfoQuery, useAddMemberRecordMutation, useGetRecordCountQuery, useGetMembersListMutation, 
  useDeleteMemberRecordMutation } = api