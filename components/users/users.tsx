import { handleErrors } from '@/lib/errorHandler';
import { getUsers } from '@/services/users/actions';
import { Pagination } from '../ui/pagination';
import { UsersHeader } from './header';
import { UsersList } from './list';

export const Users = async ({ page }: { page: number }) => {
  const data = await handleErrors(() => getUsers(page));

  if (data.isSuccess === false) {
    return <div className="text-red-500 text-center">{data.error}</div>;
  }

  return (
    <section className="relative flex flex-col items-center justify-center gap-4">
      <UsersHeader />
      <UsersList items={data.data.items} />
      <Pagination page={page} pages={data.data.pages} pathPrefix="/users/" />
    </section>
  );
};
