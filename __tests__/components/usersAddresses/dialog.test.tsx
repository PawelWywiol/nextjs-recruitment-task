import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import type { GetUsersAddressesItem } from '@/services/usersAddresses/types';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { EditUserAddressDialog } from '@/components/usersAddresses/dialog';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/services/usersAddresses/actions', () => ({
  upsertUserAddress: vi.fn(),
}));

describe('EditUserAddressDialog', () => {
  test('renders EditUserAddressDialog', async () => {
    const user = userEvent.setup();
    const item: GetUsersAddressesItem = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date(),
      postCode: '12345',
      city: 'Test City',
      countryCode: 'POL',
      street: 'Test Street',
      buildingNumber: '1',
    };

    render(
      <EditUserAddressDialog item={item}>
        <DialogTrigger asChild>
          <Button>{'Create address'}</Button>
        </DialogTrigger>
      </EditUserAddressDialog>,
    );

    expect(screen.getByRole('button', { name: 'Create address' })).toBeDefined();

    const submitButton = screen.getByRole('button', { name: 'Create address' });
    await user.click(submitButton);

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
