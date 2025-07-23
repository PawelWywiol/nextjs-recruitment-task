'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { handleErrors } from '@/lib/errorHandler';
import { cn } from '@/lib/utils';
import { upsertUserAddress } from '@/services/usersAddresses/actions';
import type { UserAddress } from '@/services/usersAddresses/types';
import {
  isAddressType,
  userAddressSchema,
  type ValidUserAddress,
  validateUserAddress,
} from '@/services/usersAddresses/validation';

import { BUTTON_STATE_TIMEOUT, DEFAULT_BUTTON_STATE } from './form.config';
import { AddressTypeFormField } from './formField/addressType';
import { CityFormFiled } from './formField/city';
import { CountryCodeFormField } from './formField/countryCode';
import { PostCodeFormField } from './formField/postCode';
import { ValidFromFormField } from './formField/validFrom';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { UsersAddressesPreview } from '../preview';

export const UserAddressForm = ({ item }: { item: UserAddress }) => {
  const [isTransitionStarted, startTransition] = useTransition();
  const [buttonState, setButtonState] = useState(DEFAULT_BUTTON_STATE);
  const router = useRouter();

  const defaultValues: ValidUserAddress = {
    ...item,
    addressType: isAddressType(item.addressType) ? item.addressType : 'HOME',
    validFrom: item.validFrom ? new Date(item.validFrom) : new Date(),
  };

  const form = useForm<ValidUserAddress>({
    resolver: zodResolver(userAddressSchema),
    defaultValues,
  });

  const onSubmit = async (values: ValidUserAddress) => {
    setButtonState({
      disabled: true,
      temporary: false,
      label: 'Processing...',
      backgroundColor: '',
      textColor: '',
    });

    const validationResult = validateUserAddress(values);

    if (!validationResult.isSuccess) {
      setButtonState({
        disabled: true,
        temporary: true,
        label: 'Validation error. Please check your input.',
        backgroundColor: 'bg-red-500',
        textColor: 'text-white',
      });

      return;
    }

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
          <AddressTypeFormField form={form} />
          <ValidFromFormField form={form} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <PostCodeFormField form={form} />
          <CityFormFiled form={form} />
          <CountryCodeFormField form={form} />
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
