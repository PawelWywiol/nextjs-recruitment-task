import type { useForm } from 'react-hook-form';

import type { ValidUserAddressPayload } from '@/services/usersAddresses/validation';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const StreetFormField = ({
  form,
}: {
  form: ReturnType<typeof useForm<ValidUserAddressPayload>>;
}) => (
  <FormField
    control={form.control}
    name="street"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Street</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
