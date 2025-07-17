import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsersHeader } from '@/components/users/header';

test('UsersHeader', () => {
  render(<UsersHeader />);
  expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toBeDefined();
});
