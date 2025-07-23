import type { Prisma } from '@prisma/client';

import type { GET_USERS_ADDRESSES_PAYLOAD } from './config';

export type UserAddress = Prisma.UsersAddressGetPayload<typeof GET_USERS_ADDRESSES_PAYLOAD>;
