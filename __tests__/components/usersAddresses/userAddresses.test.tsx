import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { handleErrors } from '@/lib/errorHandler';
import type { User } from '@/services/users/types';
import { getUserAddresses } from '@/services/usersAddresses/actions';
import type { UserAddress } from '@/services/usersAddresses/types';

import { UserAddresses } from '@/components/usersAddresses/userAddresses';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/services/usersAddresses/actions', () => ({
  upsertUserAddress: vi.fn(),
  getUserAddresses: vi.fn(),
}));

vi.mock('@/lib/errorHandler', () => ({
  handleErrors: vi.fn(),
}));

describe('UserAddresses', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders UserAddresses', async () => {
    const user: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      initials: 'JD',
      email: 'john@doe@example.com',
      status: 'ACTIVE',
    };

    const items: UserAddress[] = [
      {
        userId: 1,
        addressType: 'HOME',
        validFrom: new Date(),
        postCode: '12345',
        city: 'Test City',
        countryCode: 'POL',
        street: 'Test Street',
        buildingNumber: '1',
      },
      {
        userId: 2,
        addressType: 'WORK',
        validFrom: new Date(),
        postCode: '67890',
        city: 'Another City',
        countryCode: 'USA',
        street: 'Another Street',
        buildingNumber: '2',
      },
    ];

    const mockData = {
      items,
      total: items.length,
      page: 1,
      itemsPerPage: 10,
      pages: 1,
    };

    vi.mocked(getUserAddresses).mockResolvedValue(mockData);
    vi.mocked(handleErrors).mockImplementation(async (fn) => {
      const result = await fn();
      return { isSuccess: true, data: result };
    });

    render(await UserAddresses({ user, page: 1 }));

    expect(
      screen.getByText(`HOME valid from: ${new Date(items[0].validFrom).toLocaleString()}`),
    ).toBeDefined();
    expect(
      screen.getByText(`WORK valid from: ${new Date(items[1].validFrom).toLocaleString()}`),
    ).toBeDefined();
  });

  test('renders error message on failure', async () => {
    const user: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      initials: 'JD',
      email: 'john@doe@example.com',
      status: 'ACTIVE',
    };

    vi.mocked(getUserAddresses).mockRejectedValue(new Error('Database error'));
    vi.mocked(handleErrors).mockResolvedValue({
      isSuccess: false,
      isUnknownError: false,
      error: 'Failed to fetch user addresses',
    });

    render(await UserAddresses({ user, page: 1 }));

    expect(screen.getByText('Failed to fetch user addresses')).toBeDefined();
  });
});
