import type { UserAddressPayload } from '@/services/usersAddresses/config';

import { AddressContextMenu } from './listItemMenu';

export const AddressListItem = ({
  item: { street, buildingNumber, postCode, city, countryCode, addressType, validFrom, userId },
}: {
  item: UserAddressPayload;
}) => (
  <li className="flex flex-row items-center justify-between">
    <span className="flex flex-col">
      <small>
        {[addressType, 'valid from:', new Date(validFrom).toLocaleString()]
          .filter(Boolean)
          .join(' ')}
      </small>
      <small>
        {[street, buildingNumber, postCode, city, countryCode].filter(Boolean).join(', ')}
      </small>
    </span>
    <span className="relative">
      <AddressContextMenu
        item={{
          street,
          buildingNumber,
          postCode,
          city,
          countryCode,
          addressType,
          validFrom,
          userId,
        }}
      />
    </span>
  </li>
);
