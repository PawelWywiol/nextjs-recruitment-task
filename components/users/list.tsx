import { EllipsisVerticalIcon } from 'lucide-react';
import Link from 'next/link';

import type { GetUsersItem } from '@/services/users/types';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const UserContextMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <EllipsisVerticalIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>{'Edit'}</DropdownMenuItem>
      <DropdownMenuItem>{'Delete'}</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const UserListItem = ({ item: { id, firstName, lastName } }: { item: GetUsersItem }) => (
  <li key={id} className="flex flex-row items-center justify-between">
    <Link href={`/user/${id}/1`}>{[firstName, lastName].filter(Boolean).join(' ')}</Link>
    <UserContextMenu />
  </li>
);

export const UsersList = ({ items = [] }: { items?: GetUsersItem[] }) =>
  items.length > 0 && (
    <ul className="flex flex-col gap-2 w-full">
      {items.map((item) => (
        <UserListItem key={item.id} item={item} />
      ))}
    </ul>
  );
