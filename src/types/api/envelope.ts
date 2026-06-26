export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

export interface PagedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}
