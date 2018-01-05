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
        token: '888196987f14f62783f6baca4c6599b1f463970c',
      },
    },
  },
};

handler(event, {}, (error, response) => {
  console.log('handler finished');
  console.log(error);
  console.log(JSON.stringify(response, null, '  '));
});
