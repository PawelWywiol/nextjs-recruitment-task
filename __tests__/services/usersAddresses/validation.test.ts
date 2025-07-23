import { describe, expect, it } from 'vitest';

import { isAddressType, userAddressSchema } from '@/services/usersAddresses/validation';

describe('User Address Validation', () => {
  describe('userAddressSchema', () => {
    it('should validate valid user address data', () => {
      const validAddress = {
        userId: 1,
        addressType: 'HOME',
        validFrom: new Date(),
        postCode: '12345',
        city: 'Test City',
        countryCode: 'USA',
        street: 'Test Street',
        buildingNumber: '123',
      };

      const result = userAddressSchema.safeParse(validAddress);

      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid user ID', () => {
      const invalidAddress = {
        userId: -1,
        addressType: '',
        validFrom: 0,
        postCode: '',
        city: '',
        countryCode: '',
        street: '',
        buildingNumber: '',
      };

      const result = userAddressSchema.safeParse(invalidAddress);

      expect(result.success).toBe(false);
    });
  });

  describe('isAddressType', () => {
    it('should return true for valid address types', () => {
      expect(isAddressType('HOME')).toBe(true);
      expect(isAddressType('WORK')).toBe(true);
      expect(isAddressType('POST')).toBe(true);
      expect(isAddressType('INVOICE')).toBe(true);
    });

    it('should return false for invalid address types', () => {
      expect(isAddressType('INVALID')).toBe(false);
      expect(isAddressType('')).toBe(false);
      expect(isAddressType('home')).toBe(false);
    });
  });
});
