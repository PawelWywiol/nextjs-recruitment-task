'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { handleErrors } from '@/lib/errorHandler';
import { cn } from '@/lib/utils';
import { upsertUserAddress } from '@/services/usersAddresses/actions';
import { ISO_COUNTRY_CODES } from '@/services/usersAddresses/config';
import type { GetUsersAddressesItem } from '@/services/usersAddresses/types';
import {
  isAddressType,
  type UserAddress,
  userAddressSchema,
} from '@/services/usersAddresses/validation';

import { UsersAddressesPreview } from './preview';

import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const DEFAULT_BUTTON_STATE = {
  disabled: false,
  temporary: false,
  label: 'Submit',
  backgroundColor: '',
  textColor: '',
};

const BUTTON_STATE_TIMEOUT = 3000;

export const UserAddressForm = ({ item }: { item: GetUsersAddressesItem }) => {
  const [isTransitionStarted, startTransition] = useTransition();
  const [buttonState, setButtonState] = useState(DEFAULT_BUTTON_STATE);
  const router = useRouter();

  const defaultValues: UserAddress = {
    ...item,
    addressType: isAddressType(item.addressType) ? item.addressType : 'HOME',
    validFrom: item.validFrom ? new Date(item.validFrom).toISOString() : new Date().toISOString(),
  };

  const form = useForm<UserAddress>({
    resolver: zodResolver(userAddressSchema),
    defaultValues,
  });

  const onSubmit = async (values: UserAddress) => {
    setButtonState({
      disabled: true,
      temporary: false,
      label: 'Processing...',
      backgroundColor: '',
      textColor: '',
    });

    const data = await handleErrors(() => upsertUserAddress(item, values));

    startTransition(router.refresh);

    if (data.isSuccess) {
      setButtonState({
        disabled: true,
        temporary: true,
        label: 'Saved',
        backgroundColor: 'bg-green-500',
        textColor: 'text-white',
      });
    } else {
      setButtonState({
        disabled: true,
        temporary: true,
        label: data.error || 'Unexpected error. Please try again.',
        backgroundColor: 'bg-red-500',
        textColor: 'text-white',
      });
    }
  };

  useEffect(() => {
    if (buttonState.temporary) {
      const timer = setTimeout(() => {
        setButtonState(DEFAULT_BUTTON_STATE);
      }, BUTTON_STATE_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [buttonState]);

  const formData = form.watch();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="addressType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'Address Type'}</FormLabel>
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
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'Valid From'}</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
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
                      onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'Street'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buildingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'Building Number'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <FormField
            control={form.control}
            name="postCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'Post Code'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'City'}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{'Country'}</FormLabel>
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
        </div>
        <UsersAddressesPreview item={formData} />
        <Button
          type="submit"
          disabled={buttonState.disabled || isTransitionStarted}
          className={cn(buttonState.backgroundColor, buttonState.textColor)}
        >
          {buttonState.label}
        </Button>
      </form>
    </Form>
  );
};
