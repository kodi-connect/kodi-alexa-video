// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';

import config from './config';

async function getDevices(accessToken) {
  console.time('getDevices');
  const response = await axios({
    method: 'GET',
    url: `${config.kodiConnectUrl}/kodi/discovery`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.timeEnd('getDevices');

  return response.data;
}

export default async function discoveryHandler(event: Object) {
  const header = {
    messageId: uuid(),
    name: 'Discover.Response',
    namespace: 'Alexa.Discovery',
    payloadVersion: '3',
  };

  let payload = {};

  if (_.get(event, 'directive.header.name') === 'Discover') {
    const accessToken = _.get(event, 'directive.payload.scope.token');
    const devices = await getDevices(accessToken);

    const endpoints = devices.map(device => ({
      capabilities: device.capabilities,
      endpointId: device.id,
      description: 'Device description that\'s shown to the customer',
      displayCategories: ['OTHER'],
      friendlyName: device.name,
      manufacturerName: 'Kodi',
    }));

    payload = { endpoints };
  }

  return { header, payload };
}
