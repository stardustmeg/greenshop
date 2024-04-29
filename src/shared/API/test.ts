import request from './sdk/request.ts';
import { type Credentials } from './sdk/root.ts';

const projectKey = import.meta.env.VITE_APP_CTP_PROJECT_KEY;
const scopes = import.meta.env.VITE_APP_CTP_SCOPES;
const clientID = import.meta.env.VITE_APP_CTP_CLIENT_ID;
const clientSecret = import.meta.env.VITE_APP_CTP_CLIENT_SECRET;

const initCredentials: Credentials = {
  clientID,
  clientSecret,
  projectKey,
  scopes,
};

const productsList = await request(initCredentials);
export default productsList;
