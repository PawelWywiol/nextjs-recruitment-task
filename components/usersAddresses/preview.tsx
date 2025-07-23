import type { ValidUserAddress } from '@/services/usersAddresses/validation';

export const UsersAddressesPreview = ({ item }: { item: ValidUserAddress }) => (
  <div className="flex flex-col gap-2">
    <h3>Address preview</h3>
    <div className="flex flex-col gap-2 text-sm p-2 rounded bg-accent">
      <div className="flex flex-row gap-2">
        {[item.street, item.buildingNumber].filter(Boolean).join(' ')}
      </div>
      <div className="flex flex-row gap-2">
        {[item.postCode, item.city].filter(Boolean).join(', ')}
      </div>
      <div className="flex flex-row gap-2">{item.countryCode}</div>
    </div>
  </div>
);
