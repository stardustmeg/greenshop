import server from '@/test/mocks/node.ts';

if (typeof window !== 'undefined') {
  window.scrollTo = (): void => {};
}

global.BroadcastChannel = class implements BroadcastChannel {
  public addEventListener = vi.fn();

  public close = vi.fn();

  public dispatchEvent = vi.fn();

  public name: string;

  public onmessage: ((this: BroadcastChannel, ev: MessageEvent) => unknown) | null = null;

  public onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => unknown) | null = null;

  public postMessage = vi.fn();

  public removeEventListener = vi.fn();

  constructor(name: string) {
    this.name = name;
  }
};

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });

  // Need it for debugging API requests
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
