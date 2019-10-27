const moxios = require('moxios');

const { asyncHandler, moxiosGetRequest } = require('./util');
const { VERSION } = require('../src');

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

describe('Handler', () => {
  test('should authorize', async () => {
    const context = {};

    const p = asyncHandler(event, context);

    console.log('Waiting for moxios');

    const request = await moxiosGetRequest();

    expect(request.url).toBe('https://kodiconnect.kislan.sk/alexa');

    const data = JSON.parse(request.config.data);

    expect(data).toEqual({
      alexaRequest: {
        context,
        event,
      },
      meta: { region: 'us-east-1', version: VERSION },
    });

    await request.respondWith({ status: 200, response: { status: 'ok' } });

    await p;
  });
});
