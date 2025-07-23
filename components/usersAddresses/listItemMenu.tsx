import { EllipsisVerticalIcon } from 'lucide-react';

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
  const handleDelete = async () => {
    'use server';
    await handleErrors(() => deleteUserAddress(item));
  };

  return (
    <EditUserAddressDialog item={item}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Edit</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </EditUserAddressDialog>
  );
};
