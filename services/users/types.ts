import type { Prisma } from '@prisma/client';

import type { GET_USERS_PAYLOAD } from './config';

export type User = Prisma.UserGetPayload<typeof GET_USERS_PAYLOAD>;
