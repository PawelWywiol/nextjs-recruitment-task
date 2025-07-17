export const USERS_PER_PAGE = 5;

export const GET_USERS_PAYLOAD = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    //TODO: Not all data is needed to display in the table. Update this as needed.
  },
} as const;
