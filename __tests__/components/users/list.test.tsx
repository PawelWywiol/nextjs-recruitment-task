import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { GetUsersItem } from '@/services/users/types';

import { UsersList } from '@/components/users/list';

const items: GetUsersItem[] = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
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
