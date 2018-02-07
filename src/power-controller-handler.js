// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import { sendCommand } from './utils';

type PowerState = 'ON' | 'OFF';

function createPowerStateProperty(powerState: PowerState): Object {
  return {
    namespace: 'Alexa.PowerController',
    name: 'powerState',
    value: powerState,
    timeOfSample: (new Date()).toISOString(),
    uncertaintyInMilliseconds: 500,
  };
}

async function turnOff(accessToken: string, endpointId: string): Promise<PowerState> {
  console.time('turnOff');
  await sendCommand(accessToken, endpointId, 'turnOff');
  console.timeEnd('turnOff');
  return 'OFF';
}

async function turnOn(accessToken: string, endpointId: string): Promise<PowerState> {
  console.time('turnOn');
  await sendCommand(accessToken, endpointId, 'turnOn');
  console.timeEnd('turnOn');
  return 'ON';
}

export default async function powerControllerHandler(event: Object) {
  const header = {
    messageId: uuid(),
    name: 'Response',
    namespace: 'Alexa',
    payloadVersion: '3',
    correlationToken: _.get(event, 'directive.header.correlationToken'),
  };

  const endpoint = {
    ..._.get(event, 'directive.endpoint'),
  };

  const payload = {};

  const powerOperation = _.get(event, 'directive.header.name');
  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  let powerState: PowerState;

  switch (powerOperation) {
    case 'TurnOff':
      powerState = await turnOff(accessToken, endpointId);
      break;
    case 'TurnOn':
      powerState = await turnOn(accessToken, endpointId);
      break;
    default:
      throw new Error(`Unknown power operation: ${powerOperation}`);
  }

  const context = powerState && ({ properties: [createPowerStateProperty(powerState)] });

  return {
    context,
    header,
    endpoint,
    payload,
  };
}
