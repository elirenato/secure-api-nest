export interface ErrorMessage {
  path?: string;
  message: string;
  translationParams?: Map<string, object>;
}

export interface ErrorResponse {
  errorId?: string;
  errors: ErrorMessage[];
}
