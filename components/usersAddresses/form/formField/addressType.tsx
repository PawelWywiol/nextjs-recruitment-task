import type { useForm } from 'react-hook-form';

import type { ValidUserAddress } from '@/services/usersAddresses/validation';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AddressTypeFormField = ({
  form,
}: {
  form: ReturnType<typeof useForm<ValidUserAddress>>;
}) => (
  <FormField
    control={form.control}
    name="addressType"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Address Type</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="HOME">HOME</SelectItem>
            <SelectItem value="WORK">WORK</SelectItem>
            <SelectItem value="INVOICE">INVOICE</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);
