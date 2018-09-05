// @flow

import simpleOauth2 from 'simple-oauth2';

import { handlerImpl } from './index';

const credentials = {
  client: {
    id: 'abcdefghijklmnopqrstuvwxyz',
    secret: 'client-secret',
  },
  auth: {
    tokenHost: 'http://kodiconnect-app:3005',
  },
};

const oauth = simpleOauth2.create(credentials);

async function getAccessToken(): Promise<string> {
  const tokenConfig = {
    username: 'test@test.com',
    password: 'password',
    // scope: '<scope>', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
  };

  const result = await oauth.ownerPassword.getToken(tokenConfig);
  const accessToken = oauth.accessToken.create(result);

  return accessToken.token.access_token;
}

async function getDeviceId(token: string): Promise<string> {
  const discoveryEvent = {
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
          token,
        },
      },
    },
  };

  const response = await handlerImpl(discoveryEvent, {});

  return response.event.payload.endpoints[0].endpointId;
}

const authorizeEvent = (token: string) => ({
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
        token,
      },
    },
  },
});

const reportStateEvent = (token: string, endpointId: string) => ({
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
        token,
      },
      endpointId,
      cookie: {},
    },
    payload: {},
  },
});

async function run() {
  const accessToken = await getAccessToken();

  // const deviceId = await getDeviceId(accessToken);

  // const response = await handlerImpl(reportStateEvent(accessToken, deviceId), {});
  const response = await handlerImpl(authorizeEvent(accessToken), {});
  console.log(JSON.stringify(response, null, '  '));
}

run().then(() => {
  process.exit();
}, (error) => {
  console.error(error);
  process.exit(1);
});
