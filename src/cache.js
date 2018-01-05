/* eslint-disable */

import mongoose, { Schema } from 'mongoose';

const mongoConnectString = process.env.MONGO_URL

const mongooseConnection = (() => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoConnectString, function (error) {
      if (error) {
        console.log ('ERROR connecting to: ' + mongoConnectString + '. ' + error);
        reject(error);
      } else {
        console.log ('Succeeded connected to: ' + mongoConnectString);
        resolve();
      }
    });
  });
})();

mongoose.model('ListOfMoviesCache', new Schema({
  key: { type: String },
  time: { type: Date },
  listOfMovies: new Schema({
    id: { type: Number },
    jsonrpc: { type: String },
    result: new Schema({
      limits: new Schema({
        end: { type: Number },
        start: { type: Number },
        total: { type: Number },
      }),
      movies: [new Schema({
        label: { type: String },
        movieid: { type: Number },
      })],
    }),
  }),
}));

mongoose.model('ListOfTvShowsCache', new Schema({
  key: { type: String },
  time: { type: Date },
  listOfTvShows: new Schema({
    id: { type: Number },
    jsonrpc: { type: String },
    result: new Schema({
      limits: new Schema({
        end: { type: Number },
        start: { type: Number },
        total: { type: Number },
      }),
      tvshows: [new Schema({
        label: { type: String },
        tvshowid: { type: Number },
      })],
    }),
  }),
}));

const ListOfMoviesCacheModel = mongoose.model('ListOfMoviesCache');
const ListOfTvShowsCacheModel = mongoose.model('ListOfTvShowsCache');

export async function cacheListOfMovies(key, listOfMovies) {
  await mongooseConnection;
  const time = new Date();
  const data = new ListOfMoviesCacheModel({ key, time, listOfMovies });
  await data.save();
}

export async function getCachedListOfMovies(key) {
  await mongooseConnection;
  const doc = await ListOfMoviesCacheModel.findOne({ key }).lean();
  return doc && doc.listOfMovies;
}

export async function cacheListOfTvShows(key, listOfTvShows) {
  await mongooseConnection;
  const time = new Date();
  const data = new ListOfTvShowsCacheModel({ key, time, listOfTvShows });
  await data.save();
}

export async function getCachedListOfTvShows(key) {
  await mongooseConnection;
  const doc = await ListOfTvShowsCacheModel.findOne({ key }).lean();
  return doc && doc.listOfTvShows;
}
