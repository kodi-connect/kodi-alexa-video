// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import moxios from 'moxios';

import { type VideoFilter, createFilterFromEntities } from '../src/remote-video-player-handler';
import { handler } from '../src/index';

export function readEvent(fileName: string): Object {
  return JSON.parse(fs.readFileSync(path.join(path.resolve(__dirname), 'data', fileName)).toString());
}

export function getEventAndFilter(fileName: string): { event: Object, filter: VideoFilter } {
  const event = readEvent(fileName);
  const entities = _.get(event, 'directive.payload.entities');
  const filter = createFilterFromEntities(entities);
  return { event, filter };
}

export function checkHandler(event: Object, expectCheck: Function): Promise<void> {
  return new Promise((resolve, reject) => {
    handler(event, {}, (error) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      resolve();
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      const data = JSON.parse(request.config.data);

      expectCheck(data.rpc.filter);

      request.respondWith({ status: 200, response: { status: 'ok' } });
    });
  });
}

export function checkRequestData(event: Object, dataChecker: (data: Object) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    handler(event, {}, (error) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      resolve();
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      const data = JSON.parse(request.config.data);

      dataChecker(data);

      request.respondWith({ status: 200, response: { status: 'ok' } });
    });
  });
}

export function moxiosGetRequest(): Promise<Object> {
  return new Promise((resolve, reject) => {
    moxios.wait(() => {
      try {
        resolve(moxios.requests.mostRecent());
      } catch (error) {
        reject(error);
      }
    });
  });
}

export function asyncHandler(event: Object, context: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    handler(event, context, (error, response) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(response);
    });
  });
}
