// @flow

import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import { type VideoFilter, createFilterFromEntities } from '../src/remote-video-player-handler';

export function readEvent(fileName: string): Object {
  return JSON.parse(fs.readFileSync(path.join(path.resolve(__dirname), 'data', fileName)).toString());
}

export function getFilterFromEventFile(fileName: string): VideoFilter {
  const event = readEvent(fileName);
  const entities = _.get(event, 'directive.payload.entities');
  const filter = createFilterFromEntities(entities);
  return filter;
}
