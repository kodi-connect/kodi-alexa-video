// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';

import config from './config';

async function authorizeUser(accessToken: string, code: string) {
  const data = { region: config.awsRegion, code };
  console.time('searchAndPlay');
  await axios({
    method: 'POST',
    url: `${config.kodiConnectUrl}/alexa/authorize`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });
  console.timeEnd('searchAndPlay');
}

export default async function authorizationHandler(event: Object) {
  const authorizationOperation = _.get(event, 'directive.header.name');

  switch (authorizationOperation) {
    case 'AcceptGrant': {
      const grantCode = _.get(event, 'directive.payload.grant.code');
      const granteeToken = _.get(event, 'directive.payload.grantee.token');

      await authorizeUser(granteeToken, grantCode);
      break;
    }
    default:
      throw new Error(`Unknown authorization operation: ${authorizationOperation}`);
  }

  const header = {
    messageId: uuid(),
    name: 'AcceptGrant.Response',
    namespace: 'Alexa.Authorization',
    payloadVersion: '3',
  };

  const payload = {};

  return { header, payload };
}
