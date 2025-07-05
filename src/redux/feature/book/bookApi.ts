import { IFilterData } from '../../../interface';
import { api } from '../../api/apiSlice';

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
      query: (filter: IFilterData) => {
        const queryParameter: {
          genres?: string[];
          conditions?: string[];
          languages?: string[];
          search?: string;
        } = {};

        if ((filter.search ?? '').length > 0) queryParameter['search'] = filter.search;
        if (filter.genre?.length > 0) queryParameter['genres'] = filter.genre;
        if (filter.condition?.length > 0) queryParameter['conditions'] = filter.condition;
        if (filter.language?.length > 0) queryParameter['languages'] = filter.language;

        const queryParams = new URLSearchParams(
          queryParameter as Record<string, string>,
        ).toString();

        const url = `/books${queryParams ? `?${queryParams}&` : '?'}page=${filter.pageNumber}&size=6`;

        return {
          url: url,
          method: 'GET',
        };
      },
      providesTags: ['AddBook', 'UpdateBook'],
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
} = bookApi;
