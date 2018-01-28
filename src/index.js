// @flow

import _ from 'lodash';

import discoveryHandler from './discovery-handler';
import remoteVideoPlayerHandler from './remote-video-player-handler';
import playbackHandler from './playback-handler';
import { jsonSchemaValidation } from './validation';

const unknownNamespaceHandler = namespace => async () => {
  console.warn('Unknown namespace:', namespace);
  throw new Error(`Unknown namespace: ${namespace}`);
};

function getHandler(namespace): (event: Object, context: Object) => Promise<Object> {
  switch (namespace) {
    case 'Alexa.Discovery':
      return discoveryHandler;
    case 'Alexa.RemoteVideoPlayer':
      return remoteVideoPlayerHandler;
    case 'Alexa.PlaybackController':
      return playbackHandler;
    default:
      return unknownNamespaceHandler(namespace);
  }
}

async function handlerImpl(event, context) {
  console.log('Request:');
  console.log(JSON.stringify(event, null, '  '));

  const namespace = _.get(event, 'directive.header.namespace');

  const namespaceHandler = getHandler(namespace);

  const responseEvent = await namespaceHandler(event, context);

  const response = { event: responseEvent };

  console.log('Response:');
  console.log(JSON.stringify(response, null, '  '));

  jsonSchemaValidation(response);

  return response;
}

export function handler(event: Object, context: Object, callback: Function) {
  handlerImpl(event, context).then((response) => {
    callback(null, response);
  }, (error) => {
    callback(error);
  });
}
