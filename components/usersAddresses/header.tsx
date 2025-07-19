import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

import type { GetUsersItem } from '@/services/users/types';
import { DEFAULT_USER_ADDRESS } from '@/services/usersAddresses/config';
import type { GetUsersAddressesItem } from '@/services/usersAddresses/types';

import { EditUserAddressDialog } from './dialog';

import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';
import { Header } from '../ui/header';

export const UsersAddressesHeader = ({ user }: { user: GetUsersItem }) => {
  const item: GetUsersAddressesItem = {
    ...DEFAULT_USER_ADDRESS,
    userId: user.id,
  };

  return (
    <Header>
      <div className="flex flex-row gap-2 items-center">
        <Button asChild variant="outline">
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>
        <h1>{`${[user.firstName, user.lastName].filter(Boolean).join(' ')}`}</h1>
      </div>
      <EditUserAddressDialog item={item}>
        <DialogTrigger asChild>
          <Button>{'Create address'}</Button>
        </DialogTrigger>
      </EditUserAddressDialog>
    </Header>
  );
};
