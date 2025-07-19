import type { Prisma } from '@prisma/client';

import type { GET_USERS_PAYLOAD } from './config';

export type GetUsersItem = Prisma.UserGetPayload<typeof GET_USERS_PAYLOAD>;

export type GetUsersResult = {
  items: GetUsersItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
};
