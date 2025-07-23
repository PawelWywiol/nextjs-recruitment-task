import { z } from 'zod';

import type { HandleErrorsResult } from '@/lib/errorHandler';

export const userSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  firstName: z.string().max(60, 'First name must be at most 60 characters long').optional(),
  lastName: z.string().max(100, 'Last name must be at most 100 characters long'),
  initials: z.string().max(30, 'Initials must be at most 30 characters long').optional(),
  email: z
    .email('Email must be a valid email address')
    .max(100, 'Email must be at most 100 characters long'),
  status: z
    .enum(['ACTIVE', 'INACTIVE'], 'Status must be either ACTIVE or INACTIVE')
    .default('ACTIVE'),
});

export type ValidUser = z.infer<typeof userSchema>;

export const validateUser = (values: ValidUser): HandleErrorsResult<ValidUser> => {
  const result = userSchema.safeParse(values);

  if (!result.success) {
    return {
      isSuccess: false,
      isUnknownError: false,
      error: z.treeifyError(result.error).errors.join(', '),
    };
  }

  return {
    isSuccess: true,
    data: result.data,
  };
};
