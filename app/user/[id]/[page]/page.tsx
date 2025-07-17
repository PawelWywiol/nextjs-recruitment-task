import { UserAddresses } from '@/components/usersAddresses/userAddresses';
import { getUser } from '@/services/users/actions';
import { notFound } from 'next/navigation';

export default async function UserAddressesPage(props: {
  params: Promise<{ id: string; page: string }>;
}) {
  const params = await props.params;
  const id = Number.parseInt(params.id, 10);
  const page = Number.parseInt(params.page, 10);

  if (!id || Number.isNaN(id) || !page || Number.isNaN(page)) {
    return notFound();
  }

  const user = await getUser(id);

  if (!user) {
    return notFound();
  }

  return <UserAddresses user={user} page={page} />;
}
