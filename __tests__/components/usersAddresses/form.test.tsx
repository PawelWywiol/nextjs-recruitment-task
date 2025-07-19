import { act, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { upsertUserAddress } from '@/services/usersAddresses/actions';
import type { GetUsersAddressesItem } from '@/services/usersAddresses/types';

import { UserAddressForm } from '@/components/usersAddresses/form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/services/usersAddresses/actions', () => ({
  upsertUserAddress: vi.fn(),
}));

describe('UserAddressForm', () => {
  test('renders UserAddressForm', async () => {
    const item: GetUsersAddressesItem = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date(),
      postCode: '012345',
      city: 'Test City',
      countryCode: 'POL',
      street: 'Test Street',
      buildingNumber: '1',
    };

    vi.mocked(upsertUserAddress).mockResolvedValue({
      success: true,
      data: {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    render(<UserAddressForm item={item} />);

    expect(screen.getByLabelText('Address Type')).toBeDefined();
    expect(screen.getByLabelText('Valid From')).toBeDefined();
    expect(screen.getByLabelText('Post Code')).toBeDefined();
    expect(screen.getByLabelText('City')).toBeDefined();
    expect(screen.getByLabelText('Country')).toBeDefined();
    expect(screen.getByLabelText('Street')).toBeDefined();
    expect(screen.getByLabelText('Building Number')).toBeDefined();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined();

    await act(async () => {
      screen.getByRole('button', { name: 'Submit' }).click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const mockUpsert = vi.mocked(upsertUserAddress);

    expect(mockUpsert).toHaveBeenCalled();
  });
});
