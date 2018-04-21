// @flow

import _ from 'lodash';

import discoveryHandler from './discovery-handler';
import remoteVideoPlayerHandler from './remote-video-player-handler';
import playbackHandler from './playback-handler';
import powerControllerHandler from './power-controller-handler';
import speakerHandler from './speaker-handler';
import seekControllerHandler from './seek-controller-handler';
import authorizationHandler from './authorization-handler';
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
    case 'Alexa.PowerController':
      return powerControllerHandler;
    case 'Alexa.Speaker':
      return speakerHandler;
    case 'Alexa.SeekController':
      return seekControllerHandler;
    case 'Alexa.Authorization':
      return authorizationHandler;
    default:
      return unknownNamespaceHandler(namespace);
  }
}

async function handlerImpl(event, context) {
  console.log('Request:');
  console.log(JSON.stringify(event, null, '  '));

  const namespace = _.get(event, 'directive.header.namespace');

  const namespaceHandler = getHandler(namespace);

  const { context: responseContext, ...responseEvent } = await namespaceHandler(event, context);

  const response = { context: responseContext, event: responseEvent };

  if (process.env.NODE_ENV === 'development') jsonSchemaValidation(response);

  return response;
}

export function handler(event: Object, context: Object, callback: Function) {
  handlerImpl(event, context).then((response) => {
    console.log('Response:');
    console.log(JSON.stringify(response, null, '  '));
    callback(null, response);
  }, (error) => {
    console.error('Handler failed:', error.message);
    callback(error);
  });
}
