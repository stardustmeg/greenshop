import type { Address, User, UserRegisterData } from '@/shared/types/user.ts';

import getCustomerModel, { CustomerModel } from '../model/CustomerModel.ts';

const customerModel = getCustomerModel();

describe('Checking Customer Model', () => {
  let user: UserRegisterData;
  let address: Address;
  let customer: User | null = null;
  let editCustomer: User | null = null;
  let editAddress: User | null = null;
  let editPassword: User | null = null;
  let auth: User | null = null;

  beforeAll(() => {
    user = {
      address: 'Test address',
      birthDate: '1990-01-01',
      city: 'Test city',
      country: 'Test country',
      email: 'test-test-test@example.com',
      firstName: 'Test first name',
      lastName: 'Test last name',
      locale: 'en',
      password: 'Qqq11',
      postalCode: 'Test postal code',
    };

    address = {
      city: 'Anytown',
      country: 'DE',
      email: 'test-test-test@example.com',
      firstName: 'John',
      id: '',
      lastName: 'Doe',
      postalCode: '12345',
      state: '',
      streetName: 'Main Street',
      streetNumber: '123',
    };
  });

  it('should check if customerModel is defined', () => {
    expect(customerModel).toBeDefined();
  });

  it('should check if customerModel is an instance of CustomerModel', () => {
    expect(customerModel).toBeInstanceOf(CustomerModel);
  });

  it('should return true for valid email', async () => {
    const result = await customerModel.isValidEmail('getting-started@example.com');
    expect(result).toBe(true);
  });

  it('should return false for invalid email', async () => {
    const result = await customerModel.isValidEmail('gettingstarted@example.com');
    expect(result).toBe(false);
  });

  it('should register a new customer', async () => {
    customer = await customerModel.registrationNewCustomer(user);
    expect(typeof customer).toBe('object');
    expect(customer).toHaveProperty('addresses');
    expect(customer).toHaveProperty('defaultBillingAddressId');
    expect(customer).toHaveProperty('defaultShippingAddressId');
    expect(customer).toHaveProperty('email');
    expect(customer).toHaveProperty('firstName');
    expect(customer).toHaveProperty('id');
    expect(customer).toHaveProperty('lastName');
    expect(customer).toHaveProperty('password');
    expect(customer).toHaveProperty('version');
  });

  it('should edit the customer', async () => {
    if (customer) {
      editCustomer = await customerModel.editCustomer(
        [
          CustomerModel.actionEditFirstName('John'),
          CustomerModel.actionEditLastName('Doe'),
          CustomerModel.actionEditEmail('test-test-test@example.com'),
          CustomerModel.actionAddAddress(address),
          CustomerModel.actionEditDateOfBirth('1990-01-01'),
        ],
        customer,
      );
      expect(typeof editCustomer).toBe('object');
      expect(editCustomer).toHaveProperty('addresses');
      expect(editCustomer).toHaveProperty('defaultBillingAddressId');
      expect(editCustomer).toHaveProperty('defaultShippingAddressId');
      expect(editCustomer).toHaveProperty('email');
      expect(editCustomer).toHaveProperty('firstName');
      expect(editCustomer).toHaveProperty('id');
      expect(editCustomer).toHaveProperty('lastName');
      expect(editCustomer).toHaveProperty('password');
      expect(editCustomer).toHaveProperty('version');
    }
  });

  it('should edit the address', async () => {
    if (editCustomer) {
      const newAddressData = editCustomer.addresses[0];
      newAddressData.city = 'New York';
      newAddressData.country = 'US';

      editAddress = await customerModel.editCustomer(
        [
          CustomerModel.actionEditAddress(newAddressData),
          CustomerModel.actionEditDefaultBillingAddress(newAddressData.id),
          CustomerModel.actionEditDefaultShippingAddress(newAddressData.id),
          CustomerModel.actionRemoveAddress(newAddressData),
        ],
        editCustomer,
      );
      expect(typeof editAddress).toBe('object');
      expect(typeof editAddress).toBe('object');
      expect(editAddress).toHaveProperty('addresses');
      expect(editAddress).toHaveProperty('defaultBillingAddressId');
      expect(editAddress).toHaveProperty('defaultShippingAddressId');
      expect(editAddress).toHaveProperty('email');
      expect(editAddress).toHaveProperty('firstName');
      expect(editAddress).toHaveProperty('id');
      expect(editAddress).toHaveProperty('lastName');
      expect(editAddress).toHaveProperty('password');
      expect(editAddress).toHaveProperty('version');
    }
  });

  it('should found the customer by id', async () => {
    if (customer) {
      const getCustomer = await customerModel.getCustomerByID(customer.id);
      expect(typeof getCustomer).toBe('object');
      expect(getCustomer).toHaveProperty('addresses');
      expect(getCustomer).toHaveProperty('defaultBillingAddressId');
      expect(getCustomer).toHaveProperty('defaultShippingAddressId');
      expect(getCustomer).toHaveProperty('email');
      expect(getCustomer).toHaveProperty('firstName');
      expect(getCustomer).toHaveProperty('id');
      expect(getCustomer).toHaveProperty('lastName');
      expect(getCustomer).toHaveProperty('password');
      expect(getCustomer).toHaveProperty('version');
    }
  });

  it('should authenticate the customer', async () => {
    auth = await customerModel.authCustomer({ email: 'test-test-test@example.com', password: 'Qqq11' });
    expect(typeof auth).toBe('object');
    expect(auth).toHaveProperty('addresses');
    expect(auth).toHaveProperty('defaultBillingAddressId');
    expect(auth).toHaveProperty('defaultShippingAddressId');
    expect(auth).toHaveProperty('email');
    expect(auth).toHaveProperty('firstName');
    expect(auth).toHaveProperty('id');
    expect(auth).toHaveProperty('lastName');
    expect(auth).toHaveProperty('password');
    expect(auth).toHaveProperty('version');
  });

  it('should edit the customer password', async () => {
    if (auth) {
      editPassword = await customerModel.editPassword(auth, 'Qqq11', 'Qqq11');
      expect(typeof editPassword).toBe('object');
      expect(editPassword).toHaveProperty('addresses');
      expect(editPassword).toHaveProperty('defaultBillingAddressId');
      expect(editPassword).toHaveProperty('defaultShippingAddressId');
      expect(editPassword).toHaveProperty('email');
      expect(editPassword).toHaveProperty('firstName');
      expect(editPassword).toHaveProperty('id');
      expect(editPassword).toHaveProperty('lastName');
      expect(editPassword).toHaveProperty('password');
      expect(editPassword).toHaveProperty('version');
    }
  });

  it('should delete the customer', async () => {
    if (editPassword) {
      const deleteCustomer = await customerModel.deleteCustomer(editPassword);
      expect(deleteCustomer).toBe(true);
    }
  });
});
