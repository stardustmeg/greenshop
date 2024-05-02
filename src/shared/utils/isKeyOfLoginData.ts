import type { UserLoginData } from '../types/interfaces';

const isKeyOfLoginData = (context: UserLoginData, key: string): key is keyof UserLoginData =>
  Object.hasOwnProperty.call(context, key);

export default isKeyOfLoginData;
