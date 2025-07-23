import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { UserAddress } from '@/services/usersAddresses/types';

import { AddressListItem } from '@/components/usersAddresses/listItem';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/services/usersAddresses/actions', () => ({
  upsertUserAddress: vi.fn(),
}));

describe('AddressListItem', () => {
  test('renders AddressListItem', () => {
    const item: UserAddress = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date(),
      postCode: '12345',
      city: 'Test City',
      countryCode: 'POL',
      street: 'Test Street',
      buildingNumber: '1',
    };

    render(<AddressListItem item={item} />);

    expect(
      screen.getByText(`HOME valid from: ${new Date(item.validFrom).toLocaleString()}`),
    ).toBeDefined();
  });
});
