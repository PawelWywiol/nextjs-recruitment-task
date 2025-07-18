import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { GetUsersAddressesItem } from '@/services/usersAddresses/types';
import { UserAddressForm } from './form';

export const EditUserAddressDialog = ({
  item,
  children,
}: {
  item: GetUsersAddressesItem;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item?.userId ? 'Update address data' : 'Create address data'}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {'Please fill in the form below to update or create address data.'}
        </DialogDescription>
        <UserAddressForm item={item} />
      </DialogContent>
    </Dialog>
  );
};
