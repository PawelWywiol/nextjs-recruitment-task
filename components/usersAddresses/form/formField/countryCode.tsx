import type { useForm } from 'react-hook-form';

import { ISO_COUNTRY_CODES } from '@/services/usersAddresses/config';
import type { ValidUserAddress } from '@/services/usersAddresses/validation';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const CountryCodeFormField = ({
  form,
}: {
  form: ReturnType<typeof useForm<ValidUserAddress>>;
}) => (
  <FormField
    control={form.control}
    name="countryCode"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Country</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {Object.entries(ISO_COUNTRY_CODES).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);
