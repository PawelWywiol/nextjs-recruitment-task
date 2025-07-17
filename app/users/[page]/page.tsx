import { Users } from '@/components/users/users';

export default async function UsersPage(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const page = Number.parseInt(params.page, 10) || 1;

  return <Users page={page} />;
}
