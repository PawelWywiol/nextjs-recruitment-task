import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { User } from '@/services/users/types';

import { UsersList } from '@/components/users/list';

const items: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    status: 'ACTIVE',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    initials: 'JS',
    email: 'jane.smith@example.com',
    status: 'INACTIVE',
  },
];

describe('UsersList', () => {
  test('renders UsersList without items', () => {
    render(<UsersList />);

    expect(screen.queryByRole('list')).toBeNull();
  });

  test('renders UsersList with items', () => {
    render(<UsersList items={items} />);

    expect(screen.getByRole('list')).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Jane Smith')).toBeDefined();
  });

  test('each list item should have a context menu', () => {
    render(<UsersList items={items} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(items.length);

    for (const listItem of listItems) {
      expect(listItem.querySelector('a')).toBeDefined();
      expect(listItem.querySelector('button')).toBeDefined();
    }
  });
});
