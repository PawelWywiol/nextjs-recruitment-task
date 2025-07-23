'use server';

import { GET_USERS_PAYLOAD, USERS_PER_PAGE } from './config';
import type { User } from './types';

import prisma from '../../lib/prisma';

export const getUsers = async (page = 1, itemsPerPage = USERS_PER_PAGE) => {
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
      ...GET_USERS_PAYLOAD,
    }),
    prisma.user.count(),
  ]);

  return { items, total, page, itemsPerPage, pages: Math.ceil(total / itemsPerPage) };
};

export const getUser = async (id: number): Promise<User | null> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid user ID provided.');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    ...GET_USERS_PAYLOAD,
  });

  return user;
};
