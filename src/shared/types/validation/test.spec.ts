import * as User from './user.ts';

describe('test', () => {
  it('isUserLoginData', () => {
    expect(User.isUserLoginData({ email: 'a', password: 'b' })).toBe(true);
    expect(User.isUserLoginData({ email: 1, password: 'b' })).toBe(false);
    expect(User.isUserLoginData({ email: 'a', password: 2 })).toBe(false);
    expect(User.isUserLoginData({ email: true, password: null })).toBe(false);
    expect(User.isUserLoginData({ email: {}, password: [] })).toBe(false);
  });

  it('isFormAddress', () => {
    expect(User.isFormAddress({ city: 'a', country: 'b', postalCode: 'c', streetName: 'd' })).toBe(true);
    expect(User.isFormAddress({ city: 1, country: 'b', postalCode: 'c', streetName: 'd' })).toBe(false);
    expect(User.isFormAddress({ city: 'a', country: 2, postalCode: 'c', streetName: 'd' })).toBe(false);
    expect(User.isFormAddress({ city: 'a', country: 'b', postalCode: 3, streetName: 'd' })).toBe(false);
    expect(User.isFormAddress({ city: 'a', country: 'b', postalCode: 'c', streetName: 4 })).toBe(false);
    expect(User.isFormAddress({ city: true, country: null, postalCode: {}, streetName: [] })).toBe(false);
    expect(User.isFormAddress({ city: {}, country: [], postalCode: {}, streetName: {} })).toBe(false);
    expect(User.isFormAddress({})).toBe(false);
  });

  it('isUser', () => {
    expect(
      User.isUser({
        addresses: [],
        birthDate: 'b',
        defaultBillingAddressId: null,
        defaultShippingAddressId: null,
        email: 'c',
        firstName: 'd',
        id: 'e',
        lastName: 'f',
        locale: 'g',
        password: 'h',
        version: 1,
      }),
    ).toBe(true);
    expect(User.isUser({})).toBe(false);
  });

  it('isUserLoginData', () => {
    expect(User.isFormAddress({})).toBe(false);
  });

  it('isAddress', () => {
    expect(User.isAddress({})).toBe(false);
    expect(
      User.isAddress({
        city: 'a',
        country: 'b',
        email: 'e',
        firstName: 'f',
        id: 'h',
        lastName: 'g',
        postalCode: 'c',
        state: 'j',
        streetName: 'd',
        streetNumber: 'k',
      }),
    ).toBe(true);
  });
});
