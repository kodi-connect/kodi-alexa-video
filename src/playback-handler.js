// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';

const kodiConnectUrl = 'https://mactunnel.kislan.sk';

async function sendCommand(accessToken: string, endpointId: string, commandType: string) {
  const data = {
    id: endpointId,
    rpc: { type: 'command', commandType },
  };
  const response = await axios({
    method: 'POST',
    url: `${kodiConnectUrl}/kodi/rpc`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });
  console.log(response.data);
  return response.data;
}

async function resumePlayback(accessToken: string, endpointId: string) {
  console.time('resumePlayback');
  await sendCommand(accessToken, endpointId, 'resume');
  console.timeEnd('resumePlayback');
}

async function pausePlayback(accessToken: string, endpointId: string) {
  console.time('pausePlayback');
  await sendCommand(accessToken, endpointId, 'pause');
  console.timeEnd('pausePlayback');
}

async function stopPlayback(accessToken: string, endpointId: string) {
  console.time('stopPlayback');
  await sendCommand(accessToken, endpointId, 'stop');
  console.timeEnd('stopPlayback');
}

export default async function discoveryHandler(event: Object) {
  const header = {
    messageId: uuid(),
    name: 'Response',
    namespace: 'Alexa',
    payloadVersion: '3',
    correlationToken: _.get(event, 'directive.header.correlationToken'),
  };

  const payload = {};

  const playbackOperation = _.get(event, 'directive.header.name');
  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  switch (playbackOperation) {
    case 'Play':
      await resumePlayback(accessToken, endpointId);
      break;
    case 'Pause':
      await pausePlayback(accessToken, endpointId);
      break;
    case 'Stop':
      await stopPlayback(accessToken, endpointId);
      break;
    default:
      throw new Error(`Unknown playback operation: ${playbackOperation}`);
  }

  return { header, payload };
}
