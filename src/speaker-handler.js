// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import { sendCommand, parseResponse } from './utils';

// TODO - merge everything into single call with mapping
async function setVolume(accessToken: string, endpointId: string, volume: number) {
  console.time('setVolume');
  const data = await sendCommand(accessToken, endpointId, 'setVolume', { volume });
  console.timeEnd('setVolume');
  return data;
}

async function adjustVolume(accessToken: string, endpointId: string, volume: number) {
  console.time('adjustVolume');
  const data = await sendCommand(accessToken, endpointId, 'adjustVolume', { volume });
  console.timeEnd('adjustVolume');
  return data;
}

async function setMute(accessToken: string, endpointId: string, mute: boolean) {
  console.time('setMute');
  const data = await sendCommand(accessToken, endpointId, 'setMute', { mute });
  console.timeEnd('setMute');
  return data;
}

export default async function playbackHandler(event: Object) {
  const speakerOperation = _.get(event, 'directive.header.name');
  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  let responseData;

  switch (speakerOperation) {
    case 'SetVolume':
      responseData = await setVolume(accessToken, endpointId, _.get(event, 'directive.payload.volume', 0));
      break;
    case 'AdjustVolume':
      responseData = await adjustVolume(accessToken, endpointId, _.get(event, 'directive.payload.volume', 0));
      break;
    case 'SetMute':
      responseData = await setMute(accessToken, endpointId, _.get(event, 'directive.payload.mute', 0));
      break;
    default:
      throw new Error(`Unknown speaker operation: ${speakerOperation}`);
  }

  const { headerNamespace, headerName, payload } = parseResponse(responseData);

  const header = {
    messageId: uuid(),
    correlationToken: _.get(event, 'directive.header.correlationToken'),
    namespace: headerNamespace,
    name: headerName,
    payloadVersion: '3',
  };

  return { header, payload };
}
