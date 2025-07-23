import { z } from 'zod';

import type { HandleErrorsResult } from '@/lib/errorHandler';

import { ISO_COUNTRY_CODE } from './config';
import type { UserAddress } from './types';

export const userAddressSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  addressType: z
    .enum(['HOME', 'INVOICE', 'POST', 'WORK'], { message: 'Select a valid address type' })
    .describe('Address type must be one of HOME, INVOICE, POST, or WORK'),
  validFrom: z
    .date()
    .refine((date) => !Number.isNaN(date.getTime()), {
      message: 'Valid from date must be a valid date',
    })
    .describe('Valid from date must be a valid date'),
  postCode: z
    .string()
    .min(1, 'Post code is required')
    .max(6, 'Post code must be at most 6 characters long'),
  city: z.string().min(1, 'City is required').max(60, 'City must be at most 60 characters long'),
  countryCode: z
    .enum(ISO_COUNTRY_CODE as [string, ...string[]], { message: 'Select a valid country code' })
    .describe('Country code must be a valid ISO country code'),
  street: z
    .string()
    .min(1, 'Street is required')
    .max(100, 'Street must be at most 100 characters long'),
  buildingNumber: z
    .string()
    .min(1, 'Building number is required')
    .max(60, 'Building number must be at most 60 characters long'),
});

export type ValidUserAddress = z.infer<typeof userAddressSchema>;

export const isAddressType = (value: string): value is ValidUserAddress['addressType'] => {
  return ['HOME', 'INVOICE', 'POST', 'WORK'].includes(value);
};

export const validateUserAddress = (values: UserAddress): HandleErrorsResult<ValidUserAddress> => {
  const result = userAddressSchema.safeParse(values);

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
