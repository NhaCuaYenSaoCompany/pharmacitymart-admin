export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  q: string;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationApi<T> {
  result: T;
  meta: PaginationMeta;
}
