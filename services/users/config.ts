import type { Prisma } from '@prisma/client';

export const USERS_PER_PAGE = 5;

export const GET_USER_PAYLOAD = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    initials: true,
    email: true,
    status: true,
  },
} as const;

export type UserPayload = Prisma.UserGetPayload<typeof GET_USER_PAYLOAD>;
