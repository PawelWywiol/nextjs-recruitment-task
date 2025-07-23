import type { useForm } from 'react-hook-form';

import type { ValidUserAddress } from '@/services/usersAddresses/validation';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const BuildingNumberFormField = ({
  form,
}: {
  form: ReturnType<typeof useForm<ValidUserAddress>>;
}) => (
  <FormField
    control={form.control}
    name="buildingNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Building Number</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
