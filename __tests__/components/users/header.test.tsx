import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { UsersHeader } from '@/components/users/header';

describe('UsersHeader', () => {
  test('renders UsersHeader with correct heading', () => {
    render(<UsersHeader />);

    expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toBeDefined();
  });
});
