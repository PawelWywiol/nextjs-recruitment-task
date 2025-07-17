import { handleErrors } from '@/lib/errorHandler';
import type { GetUsersItem } from '@/services/users/types';
import { getUserAddresses } from '@/services/usersAddresses/actions';
import { Pagination } from '../ui/pagination';
import { UsersAddressesHeader } from './header';
import { UsersAddressesList } from './list';

export const UserAddresses = async ({ user, page }: { user: GetUsersItem; page: number }) => {
  const data = await handleErrors(() => getUserAddresses(user.id, page));

  if (data.isSuccess === false) {
    return <div className="text-red-500 text-center">{data.error}</div>;
  }

  return (
    <section className="relative flex flex-col items-center justify-center gap-4">
      <UsersAddressesHeader user={user} />
      <UsersAddressesList items={data.data.items} />
      <Pagination page={page} pages={data.data.pages} pathPrefix={`/user/${user.id}/`} />
    </section>
  );
};
