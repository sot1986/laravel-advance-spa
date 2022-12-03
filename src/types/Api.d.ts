export interface ApiErrorsI {
  response: {
    data: {
      message: string;
      errors: Record<string, string[]>;
    };
  };
}

export interface ApiResponseI<T> {
  data: T;
}
