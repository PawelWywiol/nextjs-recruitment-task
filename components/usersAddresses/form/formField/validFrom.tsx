import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import type { ValidUserAddressPayload } from '@/services/usersAddresses/validation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const ValidFromFormField = ({
  form,
}: {
  form: ReturnType<typeof useForm<ValidUserAddressPayload>>;
}) => (
  <FormField
    control={form.control}
    name="validFrom"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Valid From</FormLabel>

        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] pl-3 text-left font-normal',
                  !field.value && 'text-muted-foreground',
                )}
              >
                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(field.value)}
              onSelect={(date) => field.onChange(date ? date : new Date())}
              disabled={(date) => date < new Date('1900-01-01')}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);
