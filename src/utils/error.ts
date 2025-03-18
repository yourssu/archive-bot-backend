export const isError = (error: any): error is Error => {
  return error instanceof Error;
};

type ErrorResult<TError = any> =
  | {
      error: Error;
      message: string;
      type: 'Error';
    }
  | {
      error: TError;
      message: string;
      type: 'Unknown';
    };

const defaultErrorMessage = '오류가 발생했어요. 잠시 후 다시 시도해 주세요.';

const errorToResult = <TError = any>(error: TError): ErrorResult<TError> => {
  if (isError(error)) {
    return {
      type: 'Error',
      error,
      message: error.message,
    };
  }
  return {
    error,
    message: typeof error === 'string' ? error : defaultErrorMessage,
    type: 'Unknown',
  };
};

export const handleError = <TError = any>(error: TError) => {
  return errorToResult(error);
};
