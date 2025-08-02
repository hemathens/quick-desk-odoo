const { io } = require('socket.io-client');

const SOCKET_URL = 'http://localhost:5000';

describe('Socket.IO', () => {
  let client;
  beforeAll((done) => {
    client = io(SOCKET_URL, { transports: ['websocket'] });
    client.on('connect', done);
  });
  afterAll(() => {
    if (client.connected) client.disconnect();
  });

  it('should connect to the server', (done) => {
    expect(client.connected).toBe(true);
    done();
  });

  // Example: test a custom event
  // it('should receive a notification', (done) => {
  //   client.on('notification', (msg) => {
  //     expect(msg).toBe('Hello!');
  //     done();
  //   });
  //   // Simulate server emit (in real app, trigger from backend)
  // });
}); 