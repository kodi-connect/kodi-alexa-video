// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import { sendRpcMessage } from './utils';

type BaseState = { time: string };
type VolumeState = { name: 'volume', value: number } & BaseState;
type MutedState = { name: 'muted', value: boolean } & BaseState;
type PlayerState = { name: 'player', value: 'stopped' | 'paused' | 'playing' } & BaseState;
type PowerState = { name: 'power', value: boolean } & BaseState;
type KodiState = VolumeState | MutedState | PlayerState | PowerState;

async function getState(accessToken: string, endpointId: string): Promise<KodiState[]> {
  console.time('getState');
  const response = await sendRpcMessage(accessToken, endpointId, 'state');
  console.timeEnd('getState');
  console.log(response);
  const time = (new Date()).toISOString();
  return response.state.map(state => ({ ...state, time }));
}

const PLAYBACK_STATE_MAPPING = {
  stopped: 'STOPPED',
  paused: 'PAUSED',
  playing: 'PLAYING',
};

function transformState(state: KodiState): ?Object {
  switch (state.name) {
    case 'volume':
      return {
        namespace: 'Alexa.Speaker',
        name: 'volume',
        value: state.value,
        timeOfSample: state.time,
        uncertaintyInMilliseconds: 0,
      };
    case 'muted':
      return {
        namespace: 'Alexa.Speaker',
        name: 'muted',
        value: state.value,
        timeOfSample: state.time,
        uncertaintyInMilliseconds: 0,
      };
    case 'player':
      return {
        namespace: 'Alexa.PlaybackStateReporter',
        name: 'playbackState',
        value: {
          state: PLAYBACK_STATE_MAPPING[state.value],
        },
        timeOfSample: state.time,
        uncertaintyInMilliseconds: 0,
      };
    case 'power':
      return {
        namespace: 'Alexa.PowerController',
        name: 'powerState',
        value: state.value ? 'ON' : 'OFF',
        timeOfSample: '2017-02-03T16:20:50.52Z',
        uncertaintyInMilliseconds: 0,
      };
    default:
      return null;
  }
}

async function stateReportHandler(event: Object) {
  const header = {
    messageId: uuid(),
    namespace: 'Alexa',
    name: 'StateReport',
    correlationToken: _.get(event, 'directive.header.correlationToken'),
    payloadVersion: '3',
  };

  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  const endpoint = {
    ..._.get(event, 'directive.endpoint'),
  };

  const payload = {};

  const stateList = await getState(accessToken, endpointId);
  const properties = stateList.reduce((acc, state) => {
    const property = transformState(state);
    if (!property) return acc;
    return [...acc, property];
  }, []);

  const context = { properties };

  return {
    context,
    header,
    endpoint,
    payload,
  };
}

export default async function defaultHandler(event: Object) {
  const eventName = _.get(event, 'directive.header.name');

  switch (eventName) {
    case 'ReportState':
      return stateReportHandler(event);
    default:
      throw new Error(`Unknown event name: ${eventName}`);
  }
}
