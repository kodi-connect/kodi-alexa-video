// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import { sendCommand } from './utils';

async function seek(accessToken: string, endpointId: string, deltaPosition: number) {
  console.time('seek');
  const data = await sendCommand(accessToken, endpointId, 'seek', { deltaPosition });
  console.timeEnd('seek');
  return data;
}

export default async function playbackHandler(event: Object) {
  const speakerOperation = _.get(event, 'directive.header.name');
  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  let responseData;

  switch (speakerOperation) {
    case 'AdjustSeekPosition':
      responseData = await seek(accessToken, endpointId, _.get(event, 'directive.payload.deltaPositionMilliseconds', 0) / 1000);
      break;
    default:
      throw new Error(`Unknown speaker operation: ${speakerOperation}`);
  }

  const { positionMilliseconds } = responseData;

  const payload = {
    properties: [{
      name: 'positionMilliseconds',
      value: positionMilliseconds,
    }],
  };

  const header = {
    messageId: uuid(),
    correlationToken: _.get(event, 'directive.header.correlationToken'),
    namespace: 'Alexa.SeekController',
    name: 'StateReport',
    payloadVersion: '3',
  };

  return { header, payload };
}
