// @flow

import { mapGenres } from '../src/remote-video-player-handler';

describe('Genre mapping', () => {
  test('Empty', () => {
    const genres = mapGenres([]);
    expect(genres).toEqual([]);
  });

  test('Science fiction', () => {
    const genres = mapGenres(['Science fiction', 'Documentary']);
    expect(genres).toEqual(['Science fiction', 'sci-fi', 'sci fi', 'Documentary']);
  });
});
