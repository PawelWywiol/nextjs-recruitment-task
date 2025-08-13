import { z } from 'zod';

import type { HandleErrorsResult } from '@/lib/errorHandler';

import type { UserPayload } from './config';

const MIN_STRING_LENGTH = 1;
const FIRST_NAME_MAX_LENGTH = 60;
const LAST_NAME_MAX_LENGTH = 100;
const INITIALS_MAX_LENGTH = 30;
const EMAIL_MAX_LENGTH = 100;

export const userSchema: z.ZodSchema<UserPayload> = z.object({
  id: z.number().int().positive({ error: 'User ID must be a positive integer' }),
  firstName: z
    .string()
    .min(MIN_STRING_LENGTH, { error: 'First name must be at least 1 character long' })
    .max(FIRST_NAME_MAX_LENGTH, { error: 'First name must be at most 60 characters long' })
    .nullable(),
  lastName: z
    .string()
    .min(MIN_STRING_LENGTH, { error: 'Last name must be at least 1 character long' })
    .max(LAST_NAME_MAX_LENGTH, { error: 'Last name must be at most 100 characters long' }),
  initials: z
    .string()
    .min(MIN_STRING_LENGTH, { error: 'Initials must be at least 1 character long' })
    .max(INITIALS_MAX_LENGTH, { error: 'Initials must be at most 30 characters long' })
    .nullable(),
  email: z
    .email({ error: 'Email must be a valid email address' })
    .max(EMAIL_MAX_LENGTH, { error: 'Email must be at most 100 characters long' }),
  status: z
    .enum(['ACTIVE', 'INACTIVE'], { error: 'Status must be either ACTIVE or INACTIVE' })
    .default('ACTIVE'),
});

export type ValidUser = z.infer<typeof userSchema>;

export const validateUser = (values: ValidUser): HandleErrorsResult<ValidUser> => {
  const result = userSchema.safeParse(values);

  if (!result.success) {
    return {
      isSuccess: false,
      isUnknownError: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  return {
    isSuccess: true,
    data: result.data,
  };
};
