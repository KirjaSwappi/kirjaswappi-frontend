import { IFilterData } from '../../../interface';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function buildBookQueryParams(filter: IFilterData) {
  const params = new URLSearchParams();

  if (filter.search) params.append('search', filter.search);

  if (filter.genre?.length) {
    filter.genre.forEach((g) => params.append('genres', g));
  }

  if (filter.condition?.length) {
    filter.condition.forEach((c) => params.append('conditions', c));
  }

  if (filter.language?.length) {
    filter.language.forEach((l) => params.append('languages', l));
  }
  if (filter.sortBy?.length) {
    const direction = filter.sortOrder || 'asc';
    filter.sortBy.forEach((s) => params.append('sort', `${s},${direction}`));
  }

  if (filter.city) {
    params.append('city', filter.city);
  }

  return params.toString();
}

export function appendFilterQueryParams(params: URLSearchParams, filterQuery: string) {
  filterQuery
    .split('&')
    .map((pair) => pair.split('='))
    .filter(([key, value]) => key && value)
    .forEach(([key, value]) => params.append(key, value));
}

export function appendPaginationParams(
  params: URLSearchParams,
  pageNumber: number = 0,
  pageSize: number = 20,
) {
  params.append('page', String(pageNumber));
  params.append('size', String(pageSize));
}

export function appendMapBoundsParams(params: URLSearchParams, bounds: MapBounds) {
  params.append('north', bounds.north.toString());
  params.append('south', bounds.south.toString());
  params.append('east', bounds.east.toString());
  params.append('west', bounds.west.toString());
}

export function appendOwnerParams(params: URLSearchParams, ownerId?: string, notOwnerId?: string) {
  if (ownerId) params.append('ownerId', ownerId);
  if (notOwnerId) params.append('notOwnerId', notOwnerId);
}

export const commonEndpointConfig = {
  addBook: {
    url: '/books',
    method: 'POST' as const,
    invalidatesTags: ['AddBook'] as const,
  },
  updateBook: {
    url: (id: string) => `/books/${id}`,
    method: 'PUT' as const,
    invalidatesTags: ['UpdateBook'] as const,
  },
  getBookById: {
    url: (id: string) => `/books/${id}`,
    method: 'GET' as const,
    providesTags: ['AddBook', 'UpdateBook'] as const,
  },
  deleteBookById: {
    url: (id: string) => `/books/${id}`,
    method: 'DELETE' as const,
    invalidatesTags: ['DeleteBook'] as const,
  },
};
