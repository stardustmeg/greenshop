import type { UserLoginData } from '../types/interfaces';

const isKeyOfUserData = (context: UserLoginData, key: string): key is keyof UserLoginData =>
  Object.hasOwnProperty.call(context, key);

export default isKeyOfUserData;
