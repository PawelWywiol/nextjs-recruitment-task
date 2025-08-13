import { errorResultFlattenMessage, handleErrors } from '@/lib/errorHandler';
import type { UserPayload } from '@/services/users/config';
import { getUserAddresses } from '@/services/usersAddresses/actions';

import { UsersAddressesHeader } from './header';
import { UsersAddressesList } from './list';

import { Pagination } from '../ui/pagination';

export const UserAddresses = async ({ user, page }: { user: UserPayload; page: number }) => {
  const data = await handleErrors(() => getUserAddresses(user.id, page));

  if (data.isSuccess === false) {
    return <div className="text-red-500 text-center">{errorResultFlattenMessage(data)}</div>;
  }

  return (
    <section className="relative flex flex-col items-center justify-center gap-4">
      <UsersAddressesHeader user={user} />
      <UsersAddressesList items={data.data.items} />
      <Pagination page={page} pages={data.data.pages} pathPrefix={`/user/${user.id}/`} />
    </section>
  );
};
