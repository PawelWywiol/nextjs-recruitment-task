import type { Prisma } from '@prisma/client';

import type { GET_USERS_ADDRESSES_PAYLOAD } from './config';

export type GetUsersAddressesItem = Prisma.UsersAddressGetPayload<
  typeof GET_USERS_ADDRESSES_PAYLOAD
>;

export type GetUsersAddressesResult = {
  items: GetUsersAddressesItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
};
