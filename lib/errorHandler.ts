export type THandleErrorsResult<TResultData = unknown> = Promise<
  | {
      isSuccess: true;
      data: TResultData;
    }
  | {
      isSuccess: false;
      isUnknownError: boolean;
      error: string;
    }
>;

export const handleErrors = async <TResultData = unknown>(
  formCall: () => Promise<TResultData>,
): THandleErrorsResult<TResultData> => {
  try {
    const data = await formCall();

    return { isSuccess: true, data };
  } catch {
    //TODO: handle known errors, send to Sentry, etc.
    return {
      isSuccess: false,
      isUnknownError: true,
      error: 'An unexpected error occurred',
    };
  }
};
