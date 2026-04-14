import { IFilterData } from '../../../interface';
import { api } from '../../api/apiSlice';
import {
  appendFilterQueryParams,
  appendMapBoundsParams,
  appendOwnerParams,
  appendPaginationParams,
  buildBookQueryParams,
  commonEndpointConfig,
} from './helper';

export const bookApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addBook: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (data) => ({
        ...commonEndpointConfig.addBook,
        body: data,
      }),
      invalidatesTags: commonEndpointConfig.addBook.invalidatesTags,
    }),

    updateBook: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: FormData }
    >({
      query: ({ data, id }) => ({
        ...commonEndpointConfig.updateBook,
        url: commonEndpointConfig.updateBook.url(id),
        body: data,
      }),
      invalidatesTags: commonEndpointConfig.updateBook.invalidatesTags,
    }),

    getBookById: builder.query({
      query: ({ id }) => ({
        ...commonEndpointConfig.getBookById,
        url: commonEndpointConfig.getBookById.url(id),
      }),
      providesTags: commonEndpointConfig.getBookById.providesTags,
    }),

    getSupportLanguage: builder.query({
      query: () => ({
        url: '/books/supported-languages',
        method: 'GET',
      }),
    }),

    getSupportCondition: builder.query({
      query: () => ({
        url: '/books/supported-conditions',
        method: 'GET',
      }),
    }),
    getCities: builder.query({
      query: () => ({
        url: '/cities',
        method: 'GET',
      }),
    }),

    getMoreBooksByBookId: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `/books/${id}/more-books`,
        method: 'GET',
      }),
    }),

    getAllBooks: builder.query({
      query: ({
        filter = { pageNumber: 0 } as IFilterData,
        ownerId,
        latitude,
        longitude,
        notOwnerId,
        pageSize = 10,
      }: {
        filter?: IFilterData;
        ownerId?: string;
        latitude?: number;
        longitude?: number;
        notOwnerId?: string;
        pageNumber?: number;
        pageSize?: number;
      }) => {
        const queryParams = new URLSearchParams();

        const filterQuery = buildBookQueryParams(filter);
        if (filterQuery) {
          appendFilterQueryParams(queryParams, filterQuery);
        }

        appendOwnerParams(queryParams, ownerId, notOwnerId);
        appendPaginationParams(queryParams, filter.pageNumber, pageSize);
        if (latitude) queryParams.append('nearLatitude', String(latitude));
        if (longitude) queryParams.append('nearLongitude', String(longitude));
        return {
          url: `/books?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['AddBook', 'UpdateBook', 'DeleteBook'],
    }),

    deleteBookById: builder.mutation({
      query: ({ id }) => ({
        ...commonEndpointConfig.deleteBookById,
        url: commonEndpointConfig.deleteBookById.url(id),
      }),
      invalidatesTags: commonEndpointConfig.deleteBookById.invalidatesTags,
    }),

    getBooksListedById: builder.query({
      query: ({ id }) => ({
        url: `/users/${id}/books`,
        method: 'GET',
      }),
      providesTags: ['DeleteBook'],
    }),

    getBooksWithLocation: builder.query({
      query: ({
        filter = {} as IFilterData,
        bounds,
      }: {
        filter?: IFilterData;
        bounds?: {
          north: number;
          south: number;
          east: number;
          west: number;
        };
      }) => {
        const params = new URLSearchParams();

        const filterQuery = buildBookQueryParams(filter);
        if (filterQuery) appendFilterQueryParams(params, filterQuery);
        if (bounds) appendMapBoundsParams(params, bounds);

        return {
          url: `/books/map?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['AddBook', 'UpdateBook', 'DeleteBook'],
    }),

    getSupportedSwapTypes: builder.query<string[], void>({
      query: () => ({
        url: '/books/supported-swap-types',
        method: 'GET',
      }),
    }),

    getBooksNearLocation: builder.query({
      query: ({
        latitude,
        longitude,
        radiusKm = 50,
        page = 0,
        size = 20,
      }: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
        page?: number;
        size?: number;
      }) => {
        const params = new URLSearchParams();
        params.append('latitude', String(latitude));
        params.append('longitude', String(longitude));
        if (radiusKm) params.append('radiusKm', String(radiusKm));
        appendPaginationParams(params, page, size);
        return { url: `/books/near?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['AddBook', 'UpdateBook', 'DeleteBook'],
    }),

    getBooksByCity: builder.query({
      query: ({ city, page = 0, size = 20 }: { city: string; page?: number; size?: number }) => {
        const params = new URLSearchParams();
        appendPaginationParams(params, page, size);
        return { url: `/books/city/${city}?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['AddBook', 'UpdateBook', 'DeleteBook'],
    }),

    getBooksByCountry: builder.query({
      query: ({
        country,
        page = 0,
        size = 20,
      }: {
        country: string;
        page?: number;
        size?: number;
      }) => {
        const params = new URLSearchParams();
        appendPaginationParams(params, page, size);
        return { url: `/books/country/${country}?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['AddBook', 'UpdateBook', 'DeleteBook'],
    }),
  }),
});

export const {
  useAddBookMutation,
  useUpdateBookMutation,
  useGetBookByIdQuery,
  useLazyGetBookByIdQuery,
  useGetSupportLanguageQuery,
  useGetSupportConditionQuery,
  useGetAllBooksQuery,
  useGetMoreBooksByBookIdQuery,
  useGetCitiesQuery,
  useDeleteBookByIdMutation,
  useGetBooksListedByIdQuery,
  useGetBooksWithLocationQuery,
  useGetSupportedSwapTypesQuery,
  useGetBooksNearLocationQuery,
  useGetBooksByCityQuery,
  useGetBooksByCountryQuery,
} = bookApi;
