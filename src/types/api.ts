export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: PageMeta;
};

export type ApiFailure = {
  success: false;
  error: ApiErrorBody;
};
