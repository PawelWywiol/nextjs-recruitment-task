'use server';

import { GET_USERS_PAYLOAD, USERS_PER_PAGE } from './config';

import prisma from '../../lib/prisma';

export const getUsers = async (page = 1, itemsPerPage = USERS_PER_PAGE) => {
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

export const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    ...GET_USERS_PAYLOAD,
  });

  return user;
};
