import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

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
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders UserAddressForm', async () => {
    const user = userEvent.setup();

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

    render(<UserAddressForm item={item} />);

    expect(screen.getByLabelText('Address Type')).toBeDefined();
    expect(screen.getByLabelText('Valid From')).toBeDefined();
    expect(screen.getByLabelText('Post Code')).toBeDefined();
    expect(screen.getByLabelText('City')).toBeDefined();
    expect(screen.getByLabelText('Country')).toBeDefined();
    expect(screen.getByLabelText('Street')).toBeDefined();
    expect(screen.getByLabelText('Building Number')).toBeDefined();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDefined();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(vi.mocked(upsertUserAddress)).toHaveBeenCalled();
  });

  test('upsertUserAddress should not be called when form is invalid', async () => {
    const user = userEvent.setup();
    const item: GetUsersAddressesItem = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date(),
      postCode: '',
      city: '',
      countryCode: 'XXX',
      street: '',
      buildingNumber: '',
    };

    render(<UserAddressForm item={item} />);

    const streetInput = screen.getByLabelText('Street');
    await user.clear(streetInput);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(vi.mocked(upsertUserAddress)).not.toHaveBeenCalled();
  });
});
