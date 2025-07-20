import { describe, expect, it } from 'vitest';

import { handleErrors } from '@/lib/errorHandler';

describe('handleErrors', () => {
  it('should return success result with data when the function executes successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockFunction = async () => mockData;

    const result = await handleErrors(mockFunction);

    expect(result).toEqual({
      isSuccess: true,
      data: mockData,
    });
  });

  it('should return error result when the function throws an error', async () => {
    const mockFunction = async () => {
      throw new Error('Test error');
    };

    const result = await handleErrors(mockFunction);

    expect(result).toEqual({
      isSuccess: false,
      isUnknownError: true,
      error: 'An unexpected error occurred',
    });
  });
});
