import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3009/app/api' }),
  endpoints: (builder) => ({
    getAdminInfo: builder.query({
      query: () => ({
        url: '/get-admin-info',
        method: 'POST'
      }),
    }),
    addMemberRecord: builder.mutation({
      query: (memberData) => ({
        url: '/add-member-record',
        method: 'POST',
        body: memberData
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAdminInfoQuery } = api