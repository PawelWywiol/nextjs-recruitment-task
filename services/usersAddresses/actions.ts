'use server';

import type { z } from 'zod';
import prisma from '@/lib/prisma';
import { GET_USERS_ADDRESSES_PAYLOAD, USERS_ADDRESSES_PER_PAGE } from './config';
import type { GetUsersAddressesItem } from './types';
import { normalizeToSeconds } from './utils';
import { type userAddressSchema, validateUserAddress } from './validation';

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

export const upsertUserAddress = async (
  item: GetUsersAddressesItem,
  values: z.infer<typeof userAddressSchema>,
) => {
  const validationResult = validateUserAddress(values);

  if (!validationResult.success) {
    return validationResult;
  }

  const data = validationResult.data;

  if (!data) {
    return {
      success: false,
      errors: { form: 'Invalid form data' },
    };
  }

  const existing = await prisma.usersAddress.findFirst({
    where: {
      userId: item.userId,
      addressType: item.addressType,
      validFrom: {
        gte: new Date(item.validFrom.getTime() - 1000),
        lt: new Date(item.validFrom.getTime() + 1000),
      },
    },
  });

  const userAddress = await prisma.usersAddress.upsert({
    where: {
      userId_addressType_validFrom: {
        userId: existing?.userId || data.userId,
        addressType: existing?.addressType || data.addressType,
        validFrom: existing?.validFrom || normalizeToSeconds(data.validFrom),
      },
    },
    create: {
      ...data,
      validFrom: normalizeToSeconds(data.validFrom),
    },
    update: {
      postCode: data.postCode,
      city: data.city,
      countryCode: data.countryCode,
      street: data.street,
      buildingNumber: data.buildingNumber,
    },
  });

  if (!userAddress) {
    return {
      success: false,
      errors: { form: 'Failed to save address' },
    };
  }

  return {
    success: true,
    data: userAddress,
  };
};

export const deleteUserAddress = async (item: GetUsersAddressesItem) => {
  await prisma.usersAddress.delete({
    where: {
      userId_addressType_validFrom: {
        userId: item.userId,
        addressType: item.addressType,
        validFrom: item.validFrom,
      },
    },
  });

  return {
    success: true,
  };
};
