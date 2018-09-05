// @flow

import axios from 'axios';

import config from './config';

export async function sendRpcMessage(accessToken: string, endpointId: string, type: string, additionalData?: Object): Promise<Object> {
  const data = {
    id: endpointId,
    rpc: { type, ...additionalData },
  };
  const response = await axios({
    method: 'POST',
    url: `${config.kodiConnectUrl}/kodi/rpc`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });
  console.log(response.data);
  return response.data;
}

export async function sendCommand(accessToken: string, endpointId: string, commandType: string, additionalData: ?Object) {
  const data = { commandType, ...additionalData };
  return sendRpcMessage(accessToken, endpointId, 'command', data);
}

export function parseResponse(responseData: Object): { headerNamespace: string, headerName: string, payload: Object } {
  if (responseData.status === 'error') {
    switch (responseData.error) {
      case 'unreachable_device':
        return {
          headerNamespace: 'Alexa',
          headerName: 'ErrorResponse',
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Unable to reach Kodi because it appears to be offline',
          },
        };
      case 'unknown_command':
        return {
          headerNamespace: 'Alexa',
          headerName: 'ErrorResponse',
          payload: {
            type: 'FIRMWARE_OUT_OF_DATE',
            message: 'User should update Addon',
          },
        };
      case 'not_found': // Legacy support for early versions of Addon
        return {
          headerNamespace: 'Alexa',
          headerName: 'Response',
          payload: {},
        };
      default:
        return {
          headerNamespace: 'Alexa',
          headerName: 'ErrorResponse',
          payload: {
            type: 'INTERNAL_ERROR',
            message: 'Unexpected response from Kodi',
          },
        };
    }
  }

  return {
    headerNamespace: 'Alexa',
    headerName: 'Response',
    payload: {},
  };
}
