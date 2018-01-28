// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';

const kodiConnectUrl = 'https://kodiconnect.kislan.sk';

export type VideoFilter = {|
  titles: string[],
  collections: string[],
  genres: string[],
  actors: string[],
  roles: string[],
  mediaType?: ?string,
  season?: ?string,
  episode?: ?string,
|};

async function searchAndPlay(accessToken: string, endpointId: string, filter: VideoFilter) {
  const data = {
    id: endpointId,
    rpc: { type: 'command', commandType: 'searchAndPlay', filter },
  };
  console.time('searchAndPlay');
  const response = await axios({
    method: 'POST',
    url: `${kodiConnectUrl}/kodi/rpc`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });
  console.timeEnd('searchAndPlay');

  return response.data;
}

async function searchAndDisplayResults(accessToken: string, endpointId: string, filter: VideoFilter) {
  const data = {
    id: endpointId,
    rpc: { type: 'command', commandType: 'searchAndDisplay', filter },
  };
  console.time('searchAndDisplayResults');
  const response = await axios({
    method: 'POST',
    url: `${kodiConnectUrl}/kodi/rpc`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data,
  });
  console.timeEnd('searchAndDisplayResults');
  return response.data;
}

function getEntityByType(entities: Object[], type: string): ?string {
  const entity = entities.find(e => e.type === type);
  if (!entity) return null;
  return entity.value && entity.value.toLowerCase();
}

function getEntitiesByType(entities: Object[], type: string): string[] {
  return entities
    .filter(e => e.type === type)
    .map(e => e.value)
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

export function createFilterFromEntities(entities: Object[]): VideoFilter {
  const filter: VideoFilter = {
    titles: getEntitiesByType(entities, 'Video'),
    collections: getEntitiesByType(entities, 'Franchise'),
    genres: getEntitiesByType(entities, 'Genre'),
    actors: getEntitiesByType(entities, 'Actor'),
    roles: getEntitiesByType(entities, 'Character'),
    mediaType: getEntityByType(entities, 'MediaType'),
    season: getEntityByType(entities, 'Season'),
    episode: getEntityByType(entities, 'Episode'),
  };

  return filter;
}

function parseResponse(responseData: Object): { headerNamespace: string, headerName: string, payload: Object } {
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

export default async function remoteVideoPlayerHandler(event: Object) {
  const name = _.get(event, 'directive.header.name');
  const accessToken = _.get(event, 'directive.endpoint.scope.token');
  const endpointId = _.get(event, 'directive.endpoint.endpointId');

  const filter = createFilterFromEntities(_.get(event, 'directive.payload.entities', []));

  let responseData;

  switch (name) {
    case 'SearchAndPlay':
      responseData = await searchAndPlay(accessToken, endpointId, filter);
      break;
    case 'SearchAndDisplayResults':
      responseData = await searchAndDisplayResults(accessToken, endpointId, filter);
      break;
    default:
      throw new Error(`Unsupported RemoteVideoPlayer name: ${name}`);
  }

  console.log(responseData);

  const { headerNamespace, headerName, payload } = parseResponse(responseData);

  const endpoint = {
    ..._.get(event, 'directive.endpoint'),
  };

  const header = {
    messageId: uuid(),
    correlationToken: _.get(event, 'directive.header.correlationToken'),
    namespace: headerNamespace,
    name: headerName,
    payloadVersion: '3',
  };

  return { endpoint, header, payload };
}
