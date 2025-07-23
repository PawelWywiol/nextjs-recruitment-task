import type { UserAddress } from '@/services/usersAddresses/types';

import { AddressListItem } from './listItem';

export const UsersAddressesList = ({ items = [] }: { items?: UserAddress[] }) => {
  return (
    <ul className="flex flex-col gap-2 w-full">
      {items.map((item) => (
        <AddressListItem key={`${item.userId}${item.addressType}${item.validFrom}`} item={item} />
      ))}
    </ul>
  );
};
