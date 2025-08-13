import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

import type { UserPayload } from '@/services/users/config';
import { DEFAULT_USER_ADDRESS, type UserAddressPayload } from '@/services/usersAddresses/config';

import { EditUserAddressDialog } from './dialog';

import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';
import { Header } from '../ui/header';

export const UsersAddressesHeader = ({ user }: { user: UserPayload }) => {
  const item: UserAddressPayload = {
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
          <Button>Create Address</Button>
        </DialogTrigger>
      </EditUserAddressDialog>
    </Header>
  );
};
