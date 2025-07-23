import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { User } from '@/services/users/types';

import { UsersAddressesHeader } from '@/components/usersAddresses/header';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/services/usersAddresses/actions', () => ({
  upsertUserAddress: vi.fn(),
}));

describe('UsersAddressesHeader', () => {
  test('renders UsersAddressesHeader with correct heading', () => {
    const user: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      initials: 'JD',
      email: 'john@doe@example.com',
      status: 'ACTIVE',
    };

    render(<UsersAddressesHeader user={user} />);

    expect(screen.getByRole('heading', { level: 1, name: 'John Doe' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Create Address' })).toBeDefined();
  });
});
