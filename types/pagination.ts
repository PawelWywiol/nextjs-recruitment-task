export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  itemsPerPage: number;
  pages: number;
};
