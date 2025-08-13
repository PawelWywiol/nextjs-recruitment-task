'use server';

import { revalidatePath } from 'next/cache';

import { normalizeDateToSeconds, resolveDateRangeInSeconds } from '@/lib/date/date.utils';
import prisma from '@/lib/prisma';

import {
  GET_USERS_ADDRESSES_PAYLOAD,
  USERS_ADDRESSES_PER_PAGE,
  type UserAddressPayload,
} from './config';
import {
  type ValidUserAddressPayload,
  validateUserAddress,
  validateUserAddressPrimaryKey,
} from './validation';

import type { PaginatedResponse } from '@/types/pagination';

export const getUserAddresses = async (
  userId: number,
  page: number = 1,
  itemsPerPage: number = USERS_ADDRESSES_PER_PAGE,
): Promise<PaginatedResponse<UserAddressPayload>> => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID provided.');
  }

  if (!Number.isInteger(page) || page <= 0) {
    throw new Error('Invalid page number provided.');
  }

  if (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0) {
    throw new Error('Invalid items per page number provided.');
  }

  const [items, total] = await Promise.all([
    prisma.usersAddress.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
      where: { userId },
      ...GET_USERS_ADDRESSES_PAYLOAD,
    }),
    prisma.usersAddress.count({
      where: { userId },
    }),
  ]);

  return {
    items,
    total,
    page,
    itemsPerPage,
    pages: Math.ceil(total / itemsPerPage),
  };
};

export const upsertUserAddress = async (
  item: UserAddressPayload,
  values: ValidUserAddressPayload,
): Promise<ValidUserAddressPayload> => {
  const itemValidation = validateUserAddressPrimaryKey(item);
  const valuesValidation = validateUserAddress(values);

  if (!itemValidation.isSuccess) {
    throw new Error(['Validation error.', itemValidation.error].filter(Boolean).join(' '));
  }
  if (!valuesValidation.isSuccess) {
    throw new Error(['Validation error.', valuesValidation.error].filter(Boolean).join(' '));
  }

  const validItem = itemValidation.data;
  const validValues = valuesValidation.data;
  const dataValidFromNormalizedValue = normalizeDateToSeconds(validValues.validFrom);
  const dataValidFromDateRange = resolveDateRangeInSeconds(validValues.validFrom);
  const itemValidFromDateRange = resolveDateRangeInSeconds(validItem.validFrom);

  if (!dataValidFromNormalizedValue || !dataValidFromDateRange || !itemValidFromDateRange) {
    throw new Error('Invalid validFrom date provided.');
  }

  const existing = await prisma.usersAddress.findFirst({
    where: {
      userId: validItem.userId,
      addressType: validItem.addressType,
      validFrom: itemValidFromDateRange,
    },
  });

  if (existing) {
    const existingValidFromDateRange = resolveDateRangeInSeconds(existing?.validFrom);

    if (!existingValidFromDateRange) {
      throw new Error('Invalid existing validFrom date.');
    }

    const newData = await prisma.usersAddress.updateMany({
      where: {
        userId: existing.userId,
        addressType: existing.addressType,
        validFrom: existingValidFromDateRange,
      },
      data: {
        ...validValues,
        validFrom: dataValidFromNormalizedValue,
      },
    });

    if (!newData.count) {
      const blockerData = await prisma.usersAddress.findFirst({
        where: {
          userId: validItem.userId,
          addressType: validItem.addressType,
          validFrom: itemValidFromDateRange,
        },
      });

      revalidatePath(`/user/${validItem.userId}`, 'layout');
      revalidatePath(`/user/${validItem.userId}/[page]`, 'page');

      if (blockerData) {
        throw new Error('Address already exists for this user and address type.');
      }

      throw new Error('Failed to update address.');
    }

    revalidatePath(`/user/${validItem.userId}`, 'layout');
    revalidatePath(`/user/${validItem.userId}/[page]`, 'page');

    return validValues;
  }

  await prisma.usersAddress.create({
    data: {
      ...validValues,
      userId: validItem.userId,
      addressType: validItem.addressType,
      validFrom: dataValidFromNormalizedValue,
    },
  });

  return validValues;
};

export const deleteUserAddress = async (item: UserAddressPayload): Promise<boolean> => {
  const itemValidation = validateUserAddressPrimaryKey(item);

  if (!itemValidation.isSuccess) {
    throw new Error(`Validation error. ${itemValidation.error}`);
  }

  const validItem = itemValidation.data;
  const itemValidFromDateRange = resolveDateRangeInSeconds(validItem.validFrom);

  if (!itemValidFromDateRange) {
    throw new Error('Invalid validFrom date provided.');
  }

  const deleted = await prisma.usersAddress.deleteMany({
    where: {
      userId: validItem.userId,
      addressType: validItem.addressType,
      validFrom: itemValidFromDateRange,
    },
  });

  if (deleted.count === 0) {
    throw new Error('Address not found or already deleted');
  }

  revalidatePath(`/user/${validItem.userId}`, 'layout');
  revalidatePath(`/user/${validItem.userId}/[page]`, 'page');

  return true;
};
