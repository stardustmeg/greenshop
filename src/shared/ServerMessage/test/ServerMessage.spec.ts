import serverMessageModel from '../model/ServerMessageModel.ts';
import ServerMessageView from '../view/ServerMessageView.ts';

describe('check serverMessageModel', () => {
  it('serverMessageModel instance should be defined', () => {
    expect(serverMessageModel).toBeDefined();
  });
});

describe('check ServerMessageView', () => {
  it('ServerMessageView instance should be defined', () => {
    expect(ServerMessageView).toBeDefined();
  });
});
