import { beforeEach, describe, expect, it, vi } from 'vitest';

import { handleErrors } from '@/lib/errorHandler';
import prisma from '@/lib/prisma';
import {
  deleteUserAddress,
  getUserAddresses,
  upsertUserAddress,
} from '@/services/usersAddresses/actions';
import {
  GET_USERS_ADDRESSES_PAYLOAD,
  USERS_ADDRESSES_PER_PAGE,
} from '@/services/usersAddresses/config';
import type { UserAddress } from '@/services/usersAddresses/types';
import { normalizeDateToSeconds, resolveDateRangeInSeconds } from '@/services/usersAddresses/utils';
import type { ValidUserAddress } from '@/services/usersAddresses/validation';

vi.mock('@/lib/prisma', () => ({
  default: {
    usersAddress: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('UserAddresses Actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getUserAddresses', () => {
    it('should fetch user addresses with correct pagination', async () => {
      const userId = 1;
      const mockAddresses = [
        {
          id: 1,
          userId: 1,
          addressType: 'HOME',
          validFrom: new Date(),
          postCode: '12345',
          city: 'Test City',
          countryCode: 'USA',
          street: 'Test Street',
          buildingNumber: '123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId: 1,
          addressType: 'WORK',
          validFrom: new Date(),
          postCode: '54321',
          city: 'Work City',
          countryCode: 'USA',
          street: 'Work Street',
          buildingNumber: '321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockCount = 5;

      vi.mocked(prisma.usersAddress.findMany).mockResolvedValue(mockAddresses);
      vi.mocked(prisma.usersAddress.count).mockResolvedValue(mockCount);

      const result = await getUserAddresses(userId, 2, 2);

      expect(prisma.usersAddress.findMany).toHaveBeenCalledWith({
        skip: 2,
        take: 2,
        orderBy: {
          createdAt: 'desc',
        },
        where: { userId: 1 },
        ...GET_USERS_ADDRESSES_PAYLOAD,
      });

      expect(prisma.usersAddress.count).toHaveBeenCalledWith({
        where: { userId: 1 },
      });

      expect(result).toEqual({
        items: mockAddresses,
        total: mockCount,
        page: 2,
        itemsPerPage: 2,
        pages: 3,
      });
    });

    it('should use default pagination if not provided', async () => {
      vi.mocked(prisma.usersAddress.findMany).mockResolvedValue([]);
      vi.mocked(prisma.usersAddress.count).mockResolvedValue(0);

      await getUserAddresses(1);

      expect(prisma.usersAddress.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: USERS_ADDRESSES_PER_PAGE,
        orderBy: {
          createdAt: 'desc',
        },
        where: { userId: 1 },
        ...GET_USERS_ADDRESSES_PAYLOAD,
      });
    });
  });

  describe('upsertUserAddress', () => {
    const mockItem: UserAddress = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date('2023-01-01T00:00:00Z'),
      postCode: '12345',
      city: 'Old City',
      countryCode: 'USA',
      street: 'Old Street',
      buildingNumber: '123',
    };

    const mockValues: ValidUserAddress = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date('2023-01-01T00:00:00Z'),
      postCode: '12345',
      city: 'New City',
      countryCode: 'USA',
      street: 'New Street',
      buildingNumber: '123',
    };

    it('should return validation errors if validation fails', async () => {
      await expect(upsertUserAddress(mockItem, { ...mockValues, postCode: '' })).rejects.toThrow(
        'Validation error. Please check your values data.',
      );
    });

    it('should find and update an existing address', async () => {
      const mockExisting = {
        ...mockItem,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdated = {
        ...mockItem,
        city: 'New City',
        street: 'New Street',
      };

      vi.mocked(prisma.usersAddress.findFirst).mockResolvedValue(mockExisting);
      vi.mocked(prisma.usersAddress.updateMany).mockResolvedValue({
        count: 1,
      });

      const result = await upsertUserAddress(mockItem, mockValues);

      expect(prisma.usersAddress.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 1,
          addressType: 'HOME',
          validFrom: resolveDateRangeInSeconds(mockItem.validFrom),
        },
      });

      expect(prisma.usersAddress.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockExisting.userId,
          addressType: mockExisting.addressType,
          validFrom: resolveDateRangeInSeconds(mockExisting.validFrom),
        },
        data: {
          ...mockUpdated,
          validFrom: normalizeDateToSeconds(mockUpdated.validFrom),
        },
      });

      expect(result).toEqual({
        ...mockUpdated,
        validFrom: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should create a new address if none exists', async () => {
      const mockCreated = {
        ...mockItem,
        id: 1,
        city: 'New City',
        street: 'New Street',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.usersAddress.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.usersAddress.create).mockResolvedValue(mockCreated);

      const result = await upsertUserAddress(mockItem, mockValues);

      expect(prisma.usersAddress.findFirst).toHaveBeenCalled();

      expect(prisma.usersAddress.create).toHaveBeenCalledWith({
        data: {
          ...mockValues,
          validFrom: normalizeDateToSeconds(mockValues.validFrom),
        },
      });

      expect(result).toEqual({
        ...mockItem,
        city: 'New City',
        street: 'New Street',
        validFrom: new Date('2023-01-01T00:00:00Z'),
      });
    });
  });

  describe('deleteUserAddress', () => {
    it('should delete a user address', async () => {
      const mockItem: UserAddress = {
        userId: 1,
        addressType: 'HOME',
        validFrom: new Date('2023-01-01T00:00:00Z'),
        postCode: '12345',
        city: 'Test City',
        countryCode: 'USA',
        street: 'Test Street',
        buildingNumber: '123',
      };

      vi.mocked(prisma.usersAddress).deleteMany = vi.fn().mockResolvedValue({
        count: 1,
      });

      const result = await handleErrors(() => deleteUserAddress(mockItem));

      expect(prisma.usersAddress.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          addressType: 'HOME',
          validFrom: resolveDateRangeInSeconds(mockItem.validFrom),
        },
      });

      expect(result).toEqual({
        isSuccess: true,
        data: true,
      });
    });

    it('should throw error when no addresses were deleted', async () => {
      const nonExistingUserId = 9999;

      const mockItem: UserAddress = {
        userId: nonExistingUserId,
        addressType: 'HOME',
        validFrom: new Date('2023-01-01T00:00:00Z'),
        postCode: '12345',
        city: 'Test City',
        countryCode: 'USA',
        street: 'Test Street',
        buildingNumber: '123',
      };

      vi.mocked(prisma.usersAddress).deleteMany = vi.fn().mockResolvedValue({
        count: 0,
      });

      await expect(deleteUserAddress(mockItem)).rejects.toThrow(
        'Address not found or already deleted',
      );
    });
  });
});
