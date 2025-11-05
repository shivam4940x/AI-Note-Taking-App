export interface InterfaceGet<T> {
  ok: true;
  data: T;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InterfaceGetError {
  ok: false;
  error: string;
}

export type InterfaceGetResult<T> = InterfaceGet<T> | InterfaceGetError;
