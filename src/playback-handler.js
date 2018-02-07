// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import { sendCommand } from './utils';

// TODO - merge everything into single call with mapping
async function nextVideo(accessToken: string, endpointId: string) {
  console.time('nextVideo');
  await sendCommand(accessToken, endpointId, 'next');
  console.timeEnd('nextVideo');
}

async function previousVideo(accessToken: string, endpointId: string) {
  console.time('previousVideo');
  await sendCommand(accessToken, endpointId, 'previous');
  console.timeEnd('previousVideo');
}

async function startOver(accessToken: string, endpointId: string) {
  console.time('startOver');
  await sendCommand(accessToken, endpointId, 'startOver');
  console.timeEnd('startOver');
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

async function rewindPlayback(accessToken: string, endpointId: string) {
  console.time('rewindPlayback');
  await sendCommand(accessToken, endpointId, 'rewind');
  console.timeEnd('rewindPlayback');
}

async function fastForwardPlayback(accessToken: string, endpointId: string) {
  console.time('fastForwardPlayback');
  await sendCommand(accessToken, endpointId, 'fastForward');
  console.timeEnd('fastForwardPlayback');
}

export default async function playbackHandler(event: Object) {
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
    case 'Next':
      await nextVideo(accessToken, endpointId);
      break;
    case 'Previous':
      await previousVideo(accessToken, endpointId);
      break;
    case 'StartOver':
      await startOver(accessToken, endpointId);
      break;
    case 'Play':
      await resumePlayback(accessToken, endpointId);
      break;
    case 'Pause':
      await pausePlayback(accessToken, endpointId);
      break;
    case 'Stop':
      await stopPlayback(accessToken, endpointId);
      break;
    case 'Rewind':
      await rewindPlayback(accessToken, endpointId);
      break;
    case 'FastForward':
      await fastForwardPlayback(accessToken, endpointId);
      break;
    default:
      throw new Error(`Unknown playback operation: ${playbackOperation}`);
  }

  return { header, payload };
}
