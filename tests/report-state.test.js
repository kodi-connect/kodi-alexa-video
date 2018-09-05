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
      namespace: 'Alexa',
      name: 'ReportState',
      payloadVersion: '3',
      messageId: '5b0c2ac3-ef1e-429d-b538-f01e97704c54',
      correlationToken: 'token',
    },
    endpoint: {
      scope: {
        type: 'BearerToken',
        token: '05572afe7db44a715bc4d8172dff92fbec2cc966',
      },
      endpointId: 'bffb974a-beca-4a1b-b5ef-e891efdd74f4',
      cookie: {},
    },
    payload: {},
  },
};

// const expectedResponse = {
//   event: {
//     header: {
//       namespace: 'Alexa',
//       name: 'DeferredResponse',
//       correlationToken: event.directive.header.correlationToken,
//       payloadVersion: '3',
//     },
//     payload: {
//       estimatedDeferralInSeconds: 8,
//     },
//   },
// };

const expectedResponse = {
  event: {
    header: {
      namespace: 'Alexa',
      name: 'DeferredResponse',
      correlationToken: event.directive.header.correlationToken,
      payloadVersion: '3',
    },
    payload: {
      estimatedDeferralInSeconds: 8,
    },
  },
};

describe('Report state', () => {
  test('should report state', () => (
    new Promise((resolve, reject) => {
      handler(event, {}, (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        expect(response).toEqual({
          ...expectedResponse,
          event: {
            ...expectedResponse.event,
            header: {
              ...expectedResponse.event.header,
              messageId: response.event.header.messageId,
            },
          },
        });

        console.log(response);
        resolve();
      });

      console.log('Waiting for moxios');
      moxios.wait(() => {
        console.log('Moxios wait inside');
        const request = moxios.requests.mostRecent();

        expect(request.url).toBe('https://kodiconnect.kislan.sk/kodi/rpc');

        const data = JSON.parse(request.config.data);

        expect(data.rpc).toEqual({ type: 'command', commandType: 'reportState' });

        request.respondWith({ status: 200, response: { status: 'ok' } });
      });
    })
  ));
});
