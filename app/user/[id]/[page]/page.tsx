import { notFound } from 'next/navigation';

import { handleErrors } from '@/lib/errorHandler';
import { getUser } from '@/services/users/actions';

import { UserAddresses } from '@/components/usersAddresses/userAddresses';

export default async function UserAddressesPage(props: {
  params: Promise<{ id: string; page: string }>;
}) {
  const params = await props.params;
  const id = Number.parseInt(params.id, 10);
  const page = Number.parseInt(params.page, 10);

  if (!id || Number.isNaN(id) || !page || Number.isNaN(page)) {
    return notFound();
  }

  const user = await handleErrors(() => getUser(id));

  if (!user.isSuccess || !user.data) {
    return notFound();
  }

  return <UserAddresses user={user.data} page={page} />;
}
