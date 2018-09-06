// @flow

import moxios from 'moxios';

import { asyncHandler, moxiosGetRequest } from './utils';

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

const expectedResponse = {
  context: {
    properties: [],
  },
  event: {
    header: {
      namespace: 'Alexa',
      name: 'StateReport',
      correlationToken: event.directive.header.correlationToken,
      payloadVersion: '3',
    },
    endpoint: event.directive.endpoint,
    payload: {},
  },
};

describe('Report state', () => {
  test('should report state', async () => {
    const p = asyncHandler(event, {});

    const request = await moxiosGetRequest();

    expect(request.url).toBe('https://kodiconnect.kislan.sk/kodi/rpc');

    const data = JSON.parse(request.config.data);

    expect(data.rpc).toEqual({ type: 'state' });

    await request.respondWith({ status: 200, response: { status: 'ok', state: [] } });

    const response = await p;

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
  });
});
