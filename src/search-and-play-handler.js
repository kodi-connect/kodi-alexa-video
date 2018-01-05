// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';

const kodiConnectUrl = 'https://mactunnel.kislan.sk';

async function searchAndPlay(accessToken: string, endpointId: string, requestedTitles: string[]) {
  const data = {
    id: endpointId,
    rpc: { type: 'command', commandType: 'searchAndPlay', requestedTitles },
  };
  console.time('searchAndPlay');
  const response = await axios({
    method: 'POST',
    url: `${kodiConnectUrl}/kodi/rpc`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });
  console.timeEnd('searchAndPlay');

  return response.data;
}

export default async function searchAndPlayHandler(event: Object) {
  const endpoint = {
    ..._.get(event, 'directive.endpoint'),
  };

  const header = {
    messageId: uuid(),
    correlationToken: _.get(event, 'directive.header.correlationToken'),
    name: 'Response',
    namespace: 'Alexa',
    payloadVersion: '3',
  };

  const payload = {};

  const requestedTitles = event.directive.payload.entities.filter(e => e.type === 'Video').map(e => e.value);

  console.log('requestedTitles:', requestedTitles);

  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  const responseData = await searchAndPlay(accessToken, endpointId, requestedTitles);
  console.log(responseData);

  return { endpoint, header, payload };
}
