import { IFilterData } from '../../../interface';
import { api } from '../../api/apiSlice';

function buildBookQueryParams(filter: IFilterData) {
  const params: Record<string, string> = {};

  if (filter.search) params['search'] = filter.search;
  if (filter.genre && filter.genre.length > 0) params['genres'] = filter.genre.join(',');
  if (filter.condition && filter.condition.length > 0)
    params['conditions'] = filter.condition.join(',');
  if (filter.language && filter.language.length > 0)
    params['languages'] = filter.language.join(',');

  return new URLSearchParams(params).toString();
}
export const bookApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addBook: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (data) => {
        return {
          url: '/books',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['AddBook'],
    }),

    updateBook: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: FormData }
    >({
      query: ({ data, id }) => {
        return {
          url: `/books/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['UpdateBook'],
    }),

    getBookById: builder.query({
      query: ({ id }) => {
        return {
          url: `/books/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['AddBook', 'UpdateBook'],
    }),

    getSupportLanguage: builder.query({
      query: () => {
        return {
          url: '/books/supported-languages',
          method: 'GET',
        };
      },
    }),

    getSupportCondition: builder.query({
      query: () => {
        return {
          url: '/books/supported-conditions',
          method: 'GET',
        };
      },
    }),

    getMoreBooksByBookId: builder.query({
      query: ({ id }: { id: string }) => {
        return {
          url: `/books/${id}/more-books`,
          method: 'GET',
        };
      },
    }),
    getAllBooks: builder.query({
      query: ({
        filter = { pageNumber: 1 } as IFilterData,
        userId,
      }: {
        filter?: IFilterData;
        userId?: string;
      }) => {
        const queryParams = buildBookQueryParams(filter);

        // const url = `/books${queryParams ? `?${queryParams} : ''}&` : '?'}page=${filter.pageNumber}&size=6`;
        // Start building the base query string
        let url = `/books${queryParams ? `?${queryParams}` : '?'}`;

        // Append userId if available
        if (userId) {
          url += `${url.includes('?') && !url.endsWith('?') ? '&' : ''}userId=${userId}`;
        }

        // Append pagination
        url += `${url.includes('?') && !url.endsWith('?') ? '&' : ''}page=${filter.pageNumber}&size=6`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['AddBook', 'UpdateBook'],
    }),
    deleteBookById: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/books/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['DeleteBook'],
    }),
    getBooksListedById: builder.query({
      query: ({ id }) => {
        return {
          url: `/users/${id}/books`,
          method: 'GET',
        };
      },
      providesTags: ['DeleteBook'],
    }),
  }),
});

export const {
  useAddBookMutation,
  useUpdateBookMutation,
  useGetBookByIdQuery,
  useGetSupportLanguageQuery,
  useGetSupportConditionQuery,
  useGetAllBooksQuery,
  useGetMoreBooksByBookIdQuery,
  useDeleteBookByIdMutation,
  useGetBooksListedByIdQuery,
} = bookApi;
