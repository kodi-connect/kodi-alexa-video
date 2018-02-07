// @flow

import axios from 'axios';

export const kodiConnectUrl = 'https://kodiconnect.kislan.sk';

export async function sendCommand(accessToken: string, endpointId: string, commandType: string) {
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
