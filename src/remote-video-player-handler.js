// @flow

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';
import { parseResponse } from './utils';

const kodiConnectUrl = 'https://kodiconnect.kislan.sk';

export type VideoFilter = {
  titles: string[],
  collections: string[],
  genres: string[],
  actors: string[],
  roles: string[],
  mediaType?: ?string,
  season?: ?string,
  episode?: ?string,
};

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

const GENRE_MAPPING = {
  'science fiction': ['sci-fi', 'sci fi'],
};

export function mapGenres(genres: string[]) {
  return genres.reduce((acc, genre) => ([
    ...acc,
    genre,
    ...(GENRE_MAPPING[genre.toLowerCase()] || []),
  ]), []);
}

export function createFilterFromEntities(entities: Object[]): VideoFilter {
  const filter: VideoFilter = {
    titles: getEntitiesByType(entities, 'Video'),
    collections: getEntitiesByType(entities, 'Franchise'),
    genres: mapGenres(getEntitiesByType(entities, 'Genre')),
    actors: getEntitiesByType(entities, 'Actor'),
    roles: getEntitiesByType(entities, 'Character'),
    mediaType: getEntityByType(entities, 'MediaType'),
    season: getEntityByType(entities, 'Season'),
    episode: getEntityByType(entities, 'Episode'),
  };

  return filter;
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
