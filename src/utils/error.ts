export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

type ErrorResult<TError = unknown> =
  | {
      error: Error;
      message: string;
      stack: string | undefined;
      type: 'Error';
    }
  | {
      error: TError;
      message: string;
      stack: undefined;
      type: 'Unknown';
    };

const defaultErrorMessage = '오류가 발생했어요. 잠시 후 다시 시도해 주세요.';

const errorToResult = <TError = unknown>(error: TError): ErrorResult<TError> => {
  if (isError(error)) {
    return {
      type: 'Error',
      error,
      message: error.message,
      stack: error.stack,
    };
  }
  return {
    error,
    stack: undefined,
    message: typeof error === 'string' ? error : defaultErrorMessage,
    type: 'Unknown',
  };
};

export const handleError = <TError = unknown>(error: TError) => {
  return errorToResult(error);
};
