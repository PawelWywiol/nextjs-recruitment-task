import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { UserAddress } from '@/services/usersAddresses/validation';

import { UsersAddressesPreview } from '@/components/usersAddresses/preview';

describe('UsersAddressesPreview', () => {
  test('renders UsersAddressesPreview', () => {
    const item: UserAddress = {
      userId: 1,
      addressType: 'HOME',
      validFrom: new Date().toISOString(),
      postCode: '12345',
      city: 'Test City',
      countryCode: 'POL',
      street: 'Test Street',
      buildingNumber: '1',
    };

    render(<UsersAddressesPreview item={item} />);

    const heading = screen.getByRole('heading', { level: 3, name: 'Address preview' });
    const headingParent = heading.parentElement;
    const fullText = headingParent?.textContent ?? '';

    const textLines = fullText?.trim();

    expect(textLines).toMatch(/Address preview.*Test Street 1.*12345, Test City.*POL/s);
  });
});
