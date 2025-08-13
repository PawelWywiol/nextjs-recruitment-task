import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { UserAddressPayload } from '@/services/usersAddresses/config';

import { UsersAddressesList } from '@/components/usersAddresses/list';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/services/usersAddresses/actions', () => ({
  upsertUserAddress: vi.fn(),
}));

describe('UsersAddressesList', () => {
  test('renders UsersAddressesList', () => {
    const items: UserAddressPayload[] = [
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

    render(<UsersAddressesList items={items} />);

    expect(screen.getByRole('list')).toBeDefined();
    expect(
      screen.getByText(`HOME valid from: ${new Date(items[0].validFrom).toLocaleString()}`),
    ).toBeDefined();
    expect(
      screen.getByText(`WORK valid from: ${new Date(items[1].validFrom).toLocaleString()}`),
    ).toBeDefined();
  });
});
