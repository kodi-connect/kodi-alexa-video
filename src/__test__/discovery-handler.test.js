// @flow

import { handler } from '../index';

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

handler(event, {}, (error, response) => {
  console.log('handler finished');
  console.log(error);
  console.log(JSON.stringify(response, null, '  '));
});
