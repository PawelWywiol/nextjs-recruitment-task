'use client';

import { EllipsisVerticalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { handleErrors } from '@/lib/errorHandler';
import { deleteUserAddress } from '@/services/usersAddresses/actions';
import type { UserAddress } from '@/services/usersAddresses/types';

import { EditUserAddressDialog } from './dialog';

import { Button } from '../ui/button';
import { DialogTrigger } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const AddressContextMenu = ({ item }: { item: UserAddress }) => {
  const [isPending, setPending] = useState(false);
  const [isTransitionStarted, startTransition] = useTransition();
  const router = useRouter();

  const isMutating = isPending || isTransitionStarted;

  const handleDelete = async () => {
    setPending(true);
    await handleErrors(() => deleteUserAddress(item));
    startTransition(router.refresh);
    setPending(false);
  };

  return (
    <EditUserAddressDialog item={item}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isMutating}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild disabled={isMutating}>
            <DropdownMenuItem>
              <span>Edit</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleDelete} disabled={isMutating}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </EditUserAddressDialog>
  );
};
