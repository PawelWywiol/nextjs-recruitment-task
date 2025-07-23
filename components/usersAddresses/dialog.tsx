import type { UserAddress } from '@/services/usersAddresses/types';

import { UserAddressForm } from './form/form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const EditUserAddressDialog = ({
  item,
  children,
}: {
  item: UserAddress;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item?.countryCode?.length ? 'Update Address Data' : 'Create Address Data'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please fill in the form below to update or create address data.
        </DialogDescription>
        <UserAddressForm item={item} />
      </DialogContent>
    </Dialog>
  );
};
