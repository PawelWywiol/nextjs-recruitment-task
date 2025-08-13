import { beforeEach, describe, expect, it, vi } from 'vitest';

import prisma from '@/lib/prisma';
import { getUser, getUsers } from '@/services/users/actions';
import { GET_USER_PAYLOAD, USERS_PER_PAGE } from '@/services/users/config';

const UNDEFINED_USER_ID = 999;

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('User actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch users with correct pagination', async () => {
      const mockUsers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          status: 'ACTIVE',
          initials: 'JD',
          email: 'john.doe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          status: 'ACTIVE',
          initials: 'JS',
          email: 'jane.smith@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockCount = 10;

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers);
      vi.mocked(prisma.user.count).mockResolvedValue(mockCount);

      const result = await getUsers(2, 2);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 2,
        take: 2,
        orderBy: {
          createdAt: 'desc',
        },
        ...GET_USER_PAYLOAD,
      });

      expect(result).toEqual({
        items: mockUsers,
        total: mockCount,
        page: 2,
        itemsPerPage: 2,
        pages: USERS_PER_PAGE,
      });
    });

    it('should use default pagination if not provided', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);
      vi.mocked(prisma.user.count).mockResolvedValue(0);

      await getUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: USERS_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
        ...GET_USER_PAYLOAD,
      });
    });
  });

  describe('getUser', () => {
    it('should fetch a single user by ID', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        status: 'ACTIVE',
        initials: 'JD',
        email: 'john.doe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await getUser(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        ...GET_USER_PAYLOAD,
      });

      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUser(UNDEFINED_USER_ID);

      expect(result).toBeNull();
    });
  });
});
