export type HandleErrorsResult<ResultData = unknown> =
  | {
      isSuccess: true;
      data: ResultData;
    }
  | {
      isSuccess: false;
      isUnknownError: boolean;
      error: Record<string, string[] | undefined>;
    };

// biome-ignore lint/correctness/noUnusedFunctionParameters: feature flag for Sentry integration
const sendErrorToSentry = (error: unknown, label?: string): void => {
  // TODO: Implement Sentry error reporting
};

export const errorResultFlattenMessage = (
  error: HandleErrorsResult,
  separator: string = ', ',
): string => {
  if (error.isSuccess) {
    return '';
  }

  return Object.values(error.error).flat().filter(Boolean).join(separator);
};

export const handleErrors = async <ResultData = unknown>(
  formCall: () => Promise<ResultData>,
  label?: string,
): Promise<HandleErrorsResult<ResultData>> => {
  try {
    const data = await formCall();

    return { isSuccess: true, data };
  } catch (error) {
    sendErrorToSentry(error, label);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.toLocaleLowerCase().includes('database connection')) {
      return {
        isSuccess: false,
        isUnknownError: true,
        error: {
          message: ['Database connection error. Please try again later.'],
        },
      };
    }

    if (errorMessage.includes('\n')) {
      return {
        isSuccess: false,
        isUnknownError: true,
        error: {
          message: ['An unexpected error occurred.'],
        },
      };
    }

    if (error instanceof Error) {
      return {
        isSuccess: false,
        isUnknownError: false,
        error: {
          message: [errorMessage],
        },
      };
    }

    return {
      isSuccess: false,
      isUnknownError: true,
      error: {
        message: ['An unexpected error occurred.'],
      },
    };
  }
};
