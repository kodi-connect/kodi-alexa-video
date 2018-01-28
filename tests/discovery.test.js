import moxios from 'moxios';

import { handler } from '../src/index';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

const event = {
  directive: {
    header: {
      messageId: '12efe1cb-7a9c-4baf-9776-074d9166b5b8',
      name: 'Discover',
      namespace: 'Alexa.Discovery',
      payloadVersion: '3',
    },
    payload: {
      scope: {
        type: 'BearerToken',
        token: 'd033e0d07276586afd82114a58814ada2c886e7e',
      },
    },
  },
};

describe('Discovery', () => {
  test('should discover devices', () => (
    new Promise((resolve, reject) => {
      handler(event, {}, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(response);
        resolve();
      });

      console.log('Waiting for moxios');
      moxios.wait(() => {
        console.log('Moxios wait inside');
        const request = moxios.requests.mostRecent();

        expect(request.url).toBe('https://kodiconnect.kislan.sk/kodi/discovery');

        request.respondWith({ status: 200, response: [{ id: 'id', name: 'name' }] });
      });
    })
  ));
});
