import { z } from 'zod';

import type { HandleErrorsResult } from '@/lib/errorHandler';

import { ISO_COUNTRY_CODE } from './config';
import type { UserAddress } from './types';

export const userAddressPrimaryKeySchema = z.object({
  userId: z.number().int().positive({
    error: 'User ID must be a positive integer',
  }),
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK'], {
    error: 'Select a valid address type',
  }),
  validFrom: z.date().refine((date) => !Number.isNaN(date.getTime()), {
    error: 'Valid from date must be a valid date',
  }),
});

export const userAddressSchema = z.object({
  userId: z.number().int().positive({
    error: 'User ID must be a positive integer',
  }),
  addressType: z.enum(['HOME', 'INVOICE', 'POST', 'WORK'], {
    error: 'Select a valid address type',
  }),
  validFrom: z.date().refine((date) => !Number.isNaN(date.getTime()), {
    error: 'Valid from date must be a valid date',
  }),
  postCode: z
    .string()
    .min(1, { error: 'Post code is required' })
    .max(6, { error: 'Post code must be at most 6 characters long' }),
  city: z
    .string()
    .min(1, 'City is required')
    .max(60, { error: 'City must be at most 60 characters long' }),
  countryCode: z.enum(ISO_COUNTRY_CODE as [string, ...string[]], {
    error: 'Select a valid country code',
  }),
  street: z
    .string()
    .min(1, { error: 'Street is required' })
    .max(100, { error: 'Street must be at most 100 characters long' }),
  buildingNumber: z
    .string()
    .min(1, { error: 'Building number is required' })
    .max(60, { error: 'Building number must be at most 60 characters long' }),
});

export type ValidUserAddress = z.infer<typeof userAddressSchema>;
export type ValidUserAddressPrimaryKey = z.infer<typeof userAddressPrimaryKeySchema>;

export const isAddressType = (value: string): value is ValidUserAddress['addressType'] => {
  return ['HOME', 'INVOICE', 'POST', 'WORK'].includes(value);
};

export const validateUserAddressPrimaryKey = (
  value: Partial<UserAddress>,
): HandleErrorsResult<ValidUserAddressPrimaryKey> => {
  const result = userAddressPrimaryKeySchema.safeParse(value);

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
