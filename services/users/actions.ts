'use server';

import { GET_USER_PAYLOAD, USERS_PER_PAGE, type UserPayload } from './config';

import type { PaginatedResponse } from '@/types/pagination';
import prisma from '../../lib/prisma';

export const getUsers = async (
  page: number = 1,
  itemsPerPage: number = USERS_PER_PAGE,
): Promise<PaginatedResponse<UserPayload>> => {
  if (!Number.isInteger(page) || page <= 0) {
    throw new Error('Invalid page number provided.');
  }

  if (!Number.isInteger(itemsPerPage) || itemsPerPage <= 0) {
    throw new Error('Invalid items per page number provided.');
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
      ...GET_USER_PAYLOAD,
    }),
    prisma.user.count(),
  ]);

  return { items, total, page, itemsPerPage, pages: Math.ceil(total / itemsPerPage) };
};

export const getUser = async (id: number): Promise<UserPayload | null> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid user ID provided.');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    ...GET_USER_PAYLOAD,
  });

  return user;
};
