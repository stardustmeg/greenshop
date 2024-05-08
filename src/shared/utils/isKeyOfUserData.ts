import type { UserCredentials } from '../types/user';

const isKeyOfUserData = (context: UserCredentials, key: string): key is keyof UserCredentials =>
  Object.hasOwnProperty.call(context, key);

export default isKeyOfUserData;
