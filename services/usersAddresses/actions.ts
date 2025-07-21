'use server';

import prisma from '@/lib/prisma';

import { GET_USERS_ADDRESSES_PAYLOAD, USERS_ADDRESSES_PER_PAGE } from './config';
import type { GetUsersAddressesItem } from './types';
import { normalizeDateToSeconds, resolveDateRangeInSeconds } from './utils';
import { type UserAddress, validateUserAddress } from './validation';

export const getUserAddresses = async (
  userId: number,
  page = 1,
  itemsPerPage = USERS_ADDRESSES_PER_PAGE,
) => {
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

export const upsertUserAddress = async (item: GetUsersAddressesItem, values: UserAddress) => {
  const validationResult = validateUserAddress(values);

  if (!validationResult.success || !validationResult.data) {
    throw new Error('Validation error. Please check your input.');
  }

  const data = validationResult.data;

  const existing = await prisma.usersAddress.findFirst({
    where: {
      userId: item.userId,
      addressType: item.addressType,
      validFrom: resolveDateRangeInSeconds(item.validFrom),
    },
  });

  if (existing) {
    const newData = await prisma.usersAddress.updateMany({
      where: {
        userId: existing.userId,
        addressType: existing.addressType,
        validFrom: resolveDateRangeInSeconds(existing.validFrom),
      },
      data: {
        ...data,
        validFrom: normalizeDateToSeconds(data.validFrom),
      },
    });

    if (!newData.count) {
      const blockerData = await prisma.usersAddress.findFirst({
        where: {
          userId: item.userId,
          addressType: item.addressType,
          validFrom: resolveDateRangeInSeconds(item.validFrom),
        },
      });

      if (blockerData) {
        throw new Error('Address already exists for this user and address type.');
      }

      throw new Error('Failed to update address.');
    }

    return data;
  }

  await prisma.usersAddress.create({
    data: {
      ...data,
      userId: item.userId,
      addressType: item.addressType,
      validFrom: normalizeDateToSeconds(data.validFrom),
    },
  });

  return data;
};

export const deleteUserAddress = async (item: GetUsersAddressesItem) => {
  const deleted = await prisma.usersAddress.deleteMany({
    where: {
      userId: item.userId,
      addressType: item.addressType,
      validFrom: resolveDateRangeInSeconds(item.validFrom),
    },
  });

  if (deleted.count === 0) {
    throw new Error('Address not found or already deleted');
  }

  return { success: true };
};
