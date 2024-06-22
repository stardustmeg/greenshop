import server from '@/test/mocks/node.ts';

if (typeof window !== 'undefined') {
  window.scrollTo = (): void => {};
}

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });

  // Need it for debugging api requests
  // server.events.on('request:start', ({ request }) => {
  //   console.log('Outgoing:', request.method, request.url);
  // });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
