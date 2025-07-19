import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { handleErrors } from '@/lib/errorHandler';
import { getUsers } from '@/services/users/actions';

import { Users } from '@/components/users/users';

vi.mock('@/services/users/actions', () => ({
  getUsers: vi.fn(),
}));

vi.mock('@/lib/errorHandler', () => ({
  handleErrors: vi.fn(),
}));

describe('Users', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders Users with correct heading', async () => {
    const mockData = {
      items: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
        },
      ],
      total: 2,
      page: 1,
      itemsPerPage: 10,
      pages: 1,
    };

    vi.mocked(getUsers).mockResolvedValue(mockData);
    vi.mocked(handleErrors).mockImplementation(async (fn) => {
      const result = await fn();
      return { isSuccess: true, data: result };
    });

    render(await Users({ page: 1 }));

    expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Jane Smith')).toBeDefined();
  });

  test('renders error message on failure', async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error('Database error'));
    vi.mocked(handleErrors).mockResolvedValue({
      isSuccess: false,
      isUnknownError: false,
      error: 'Failed to fetch users',
    });

    render(await Users({ page: 1 }));

    expect(screen.getByText('Failed to fetch users')).toBeDefined();
  });
});
