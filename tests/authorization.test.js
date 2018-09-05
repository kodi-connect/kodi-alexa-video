// @flow

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
      namespace: 'Alexa.Authorization',
      name: 'AcceptGrant',
      payloadVersion: '3',
      messageId: '07727ea9-77b0-4185-8be7-8c357a124d65',
    },
    payload: {
      grant: {
        type: 'OAuth2.AuthorizationCode',
        code: 'RHZEbholRXCKFvUecEWU',
      },
      grantee: {
        type: 'BearerToken',
        token: '6f2dc0588323d6977a5c1afc23a687f6e571cbc3',
      },
    },
  },
};

describe('Authorization', () => {
  test('should authorize', () => (
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

        expect(request.url).toBe('https://kodiconnect.kislan.sk/kodi/alexa/authorization');

        const data = JSON.parse(request.config.data);

        expect(data.rpc).toEqual({ type: 'command', commandType: 'reportStateToAlexa' });

        request.respondWith({ status: 200, response: { status: 'ok' } });
      });
    })
  ));
});
