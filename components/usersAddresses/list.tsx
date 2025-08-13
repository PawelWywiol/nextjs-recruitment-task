import type { UserAddressPayload } from '@/services/usersAddresses/config';

import { AddressListItem } from './listItem';

export const UsersAddressesList = ({ items = [] }: { items?: UserAddressPayload[] }) => {
  return (
    <ul className="flex flex-col gap-2 w-full">
      {items.map((item) => (
        <AddressListItem key={`${item.userId}${item.addressType}${item.validFrom}`} item={item} />
      ))}
    </ul>
  );
};
