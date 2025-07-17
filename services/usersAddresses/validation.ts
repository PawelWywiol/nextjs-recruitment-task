import { z } from 'zod';
import { ISO_COUNTRY_CODE } from './config';

export const userAddressSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  addressType: z
    .enum(['HOME', 'INVOICE', 'POST', 'WORK'])
    .describe('Address type must be one of HOME, INVOICE, POST, or WORK'),
  validFrom: z.iso.datetime('Valid from date must be a valid ISO datetime string'),
  postCode: z
    .string()
    .min(1, 'Post code is required')
    .max(6, 'Post code must be at most 6 characters long'),
  city: z.string().min(1, 'City is required').max(60, 'City must be at most 60 characters long'),
  countryCode: z
    .enum(ISO_COUNTRY_CODE as [string, ...string[]])
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

export type UserAddress = z.infer<typeof userAddressSchema>;

export const isAddressType = (value: string): value is UserAddress['addressType'] => {
  return ['HOME', 'INVOICE', 'POST', 'WORK'].includes(value);
};

export const validateUserAddress = (values: UserAddress) => {
  const result = userAddressSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
};
