import { setupServer } from 'msw/node';

import handlers from './handler.ts';

const server = setupServer(...handlers);

export default server;
