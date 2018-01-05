/* eslint-disable */

import _ from 'lodash';
import uuid from 'uuid/v4';
import axios from 'axios';
import { findBestMatch } from 'string-similarity';

import { cacheListOfMovies, getCachedListOfMovies, cacheListOfTvShows, getCachedListOfTvShows } from './cache';

// const minSimilarityRating = 0.7;
const minSimilarityRating = 0.1;

const FILTER_UNWATCHED = { "operator": "lessthan", "field": "playcount", "value": "1" };
const SORT_EPISODE = { "method": "episode", "order": "ascending" };

async function getListOfMovies(kodiConnString) {
  const key = 'keks';
  let data;
  // console.time('GetCache VideoLibrary.GetMovies');
  // data = await getCachedListOfMovies(key);
  // console.timeEnd('GetCache VideoLibrary.GetMovies');

  if (!data) {
    console.log('Not cached, fetching');
    const request = { "jsonrpc": "2.0", "method": 'VideoLibrary.GetMovies', "id": 1 };
    console.time('VideoLibrary.GetMovies');
    const response = await axios.post(kodiConnString, request);
    console.timeEnd('VideoLibrary.GetMovies');

    data = response.data;
    //! TODO - validate data

    // console.time('SetCache VideoLibrary.GetMovies');
    // await cacheListOfMovies(key, data);
    // console.timeEnd('SetCache VideoLibrary.GetMovies');
  }

  return _.get(data, 'result.movies') || [];
}

async function getListOfTvShows(kodiConnString) {
  // VideoLibrary.GetTVShows

  const key = 'keks';
  let data;
  // console.time('GetCache VideoLibrary.GetTVShows');
  // data = await getCachedListOfTvShows(key);
  // console.timeEnd('GetCache VideoLibrary.GetTVShows');

  if (!data) {
    console.log('Not cached, fetching');
    const request = { "jsonrpc": "2.0", "method": 'VideoLibrary.GetTVShows', "id": 1 };
    console.time('VideoLibrary.GetTVShows');
    const response = await axios.post(kodiConnString, request);
    console.timeEnd('VideoLibrary.GetTVShows');

    data = response.data;
    //! TODO - validate data

    // console.time('SetCache VideoLibrary.GetTVShows');
    // await cacheListOfTvShows(key, data);
    // console.timeEnd('SetCache VideoLibrary.GetTVShows');
  }

  // console.log(JSON.stringify(data, null, '  '));

  return _.get(data, 'result.tvshows') || [];
}

async function getNextUnwatchedEpisode(kodiConnString, tvShowId) {
  // RPCString("VideoLibrary.GetEpisodes", {"tvshowid": int(show_id)}, filters=[FILTER_UNWATCHED], sort=SORT_EPISODE, fields=["playcount"], limits=(0, 1))

  const request = {
    "jsonrpc": "2.0",
    "method": 'VideoLibrary.GetEpisodes',
    "id": 1,
    params: {
      tvshowid: tvShowId,
      filter: FILTER_UNWATCHED,
      sort: SORT_EPISODE,
      properties: ['playcount'],
      limits: { start: 0, end: 1 },
    },
  };

  console.time('VideoLibrary.GetEpisodes');
  const response = await axios.post(kodiConnString, request);
  console.timeEnd('VideoLibrary.GetEpisodes');

  const data = response.data;

  const episodeId = _.get(data, 'result.episodes[0].episodeid');

  return episodeId;
}

async function playMovie(kodiConnString, movieId) {
  // TODO - do not wait for response
  // RPCString("Player.Open", {"item": {"movieid": movie_id}, "options": {"resume": resume}})
  const request = {
    "jsonrpc": "2.0",
    "method": 'Player.Open',
    "id": 1,
    params: {
      item: { movieid: movieId },
      options: { resume: true },
    },
  };

  // console.time('playMovie');
  // const response = await axios.post(kodiConnString, request);
  // console.timeEnd('playMovie');
  // console.log(response.data);

  axios.post(kodiConnString, request);
}

async function playEpisode(kodiConnString, episodeId) {
  // TODO - do not wait for response
  // RPCString("Player.Open", {"item": {"episodeid": ep_id}, "options": {"resume": resume}})
  const request = {
    "jsonrpc": "2.0",
    "method": 'Player.Open',
    "id": 1,
    params: {
      item: { episodeid: episodeId },
      options: { resume: true },
    },
  };

  axios.post(kodiConnString, request);
}

function getBestOfTheBest(bestMatches) {
  if (!bestMatches || bestMatches.length === 0) return null;
  return bestMatches.reduce((best, current) => best.rating > current.rating ? best : current);
}

function getEntityId(bestMatch, entities, propertyName) {
  for (let entity of entities) {
    if (bestMatch.target === entity.label) return entity[propertyName];
  }

  //! This should never happend
  throw new Error('What?!');
}

function findBestEntityMatch(entities, requestedTitles) {
  const entityTitles = entities.map(entity => entity.label);

  const bestMatches = requestedTitles
    .map(requestedTitle => findBestMatch(requestedTitle, entityTitles))
    .map(match => match.bestMatch)
    .filter(match => match.rating > minSimilarityRating);

  console.log('bestMatches:');
  console.log(JSON.stringify(bestMatches, null, '  '));

  const bestMatch = getBestOfTheBest(bestMatches);

  return bestMatch;
}

async function findMovie(kodiConnString, requestedTitles) {
  const movies = await getListOfMovies(kodiConnString);

  const bestMatch = findBestEntityMatch(movies, requestedTitles);

  if (!bestMatch) return null;

  const movieId = getEntityId(bestMatch, movies, 'movieid');

  console.log(movieId);

  return movieId;
}

async function findTvShow(kodiConnString, requestedTitles) {
  const shows = await getListOfTvShows(kodiConnString);

  const bestMatch = findBestEntityMatch(shows, requestedTitles);

  if (!bestMatch) return null;

  const tvShowId = getEntityId(bestMatch, shows, 'tvshowid');

  console.log(tvShowId);

  return tvShowId;
}

async function findTvShowNextUnwatchedEpisode(kodiConnString, requestedTitles) {
  const tvShowId = await findTvShow(kodiConnString, requestedTitles);
  if (!tvShowId) return null;
  const episodeId = await getNextUnwatchedEpisode(kodiConnString, tvShowId);
  return episodeId;
}

// export default async function searchAndPlayHandler(event, context, kodiConnString) {
//   console.log('kodiConnString:', kodiConnString);

//   const endpoint = {
//     ..._.get(event, 'directive.endpoint'),
//   };

//   const header = {
//     messageId: uuid(),
//     correlationToken: _.get(event, 'directive.header.correlationToken'),
//     name: 'SearchAndDisplayResults',
//     namespace: 'Alexa.RemoteVideoPlayer',
//     payloadVersion: '3',
//   };

//   const payload = {};

//   const requestedTitles = event.directive.payload.entities.filter(e => e.type === 'Video').map(e => e.value);

//   console.log('requestedTitles:', requestedTitles);

//   const [movieId, episodeId] = await Promise.all([
//     findMovie(kodiConnString, requestedTitles),
//     findTvShowNextUnwatchedEpisode(kodiConnString, requestedTitles),
//   ]);

//   console.log('movieId:', movieId);
//   console.log('episodeId:', episodeId);

//   if (movieId) {
//     await playMovie(kodiConnString, movieId);
//   } else if (episodeId) {
//     await playEpisode(kodiConnString, episodeId);
//   } else {
//     console.log('Not found');
//   }

//   return { endpoint, header, payload };
// }

const kodiConnectUrl = 'https://kodiconnect.kislan.sk';

async function searchAndPlay(requestedTitles, accessToken) {
  const request = { type: 'command', commandType: 'searchAndPlay', requestedTitles };
  console.time('searchAndPlay');
  const response = await axios({
    method: 'POST',
    url: `${kodiConnectUrl}/kodi`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: request,
  });
  console.timeEnd('searchAndPlay');
}

export default async function searchAndPlayHandler(event, context, kodiConnString) {
  console.log('kodiConnString:', kodiConnString);

  const endpoint = {
    ..._.get(event, 'directive.endpoint'),
  };

  const header = {
    messageId: uuid(),
    correlationToken: _.get(event, 'directive.header.correlationToken'),
    name: 'SearchAndDisplayResults',
    namespace: 'Alexa.RemoteVideoPlayer',
    payloadVersion: '3',
  };

  const payload = {};

  const requestedTitles = event.directive.payload.entities.filter(e => e.type === 'Video').map(e => e.value);

  console.log('requestedTitles:', requestedTitles);

  const response = await searchAndPlay(requestedTitles, _.get(event, 'directive.endpoint.scope.token'));

  return { endpoint, header, payload };
}
