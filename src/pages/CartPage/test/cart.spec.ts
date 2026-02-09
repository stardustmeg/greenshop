import { ApiClient } from '@/shared/API/sdk/client.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { vi } from 'vitest';

import CartPageModel from '../model/CartPageModel.ts';

/**
 * @vitest-environment jsdom
 */

vi.mock('@commercetools/sdk-client-v2', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    ClientBuilder: vi.fn().mockReturnValue({
      build: vi.fn().mockReturnThis(),
      withAnonymousSessionFlow: vi.fn().mockReturnThis(),
      withHttpMiddleware: vi.fn().mockReturnThis(),
      withProjectKey: vi.fn().mockReturnThis(),
    }),
    createApiBuilderFromCtpClient: vi.fn().mockReturnValue({
      withAnonymousSessionFlow: vi.fn().mockReturnThis(),
      withHttpMiddleware: vi.fn().mockReturnThis(),
      withProjectKey: vi.fn().mockReturnThis(),
    }),
  };
});

const parent = createBaseElement({
  tag: 'div',
});
const cart = new CartPageModel(parent);

describe('ApiClient tests', () => {
  it('should be defined', () => {
    expect(cart).toBeDefined();
  });

  it('should check if cart is an instance of CartPageModel', () => {
    expect(cart).toBeInstanceOf(CartPageModel);
  });

  it('should create an anonymous connection when no auth token is present', () => {
    const apiClient = new ApiClient();
    const connection = apiClient.apiRoot();

    expect(connection).toBeDefined();
  });

  it('should create an auth connection when an auth token is present', () => {
    const apiClient = new ApiClient();
    const connection = apiClient.apiRoot();

    expect(connection).toBeDefined();
  });
});
