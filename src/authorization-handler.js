// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';

export default async function authorizationHandler(event: Object) {
  const authorizationOperation = _.get(event, 'directive.header.name');

  // const grantType = _.get(event, 'directive.payload.grant.type');
  // const grantCode = _.get(event, 'directive.payload.grant.code');
  // const granteeType = _.get(event, 'directive.payload.grantee.type');
  // const granteeToken = _.get(event, 'directive.payload.grantee.token');

  switch (authorizationOperation) {
    case 'AcceptGrant':
      break;
    default:
      throw new Error(`Unknown speaker operation: ${authorizationOperation}`);
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
