// @flow

import moxios from 'moxios';

import { getEventAndFilter, checkHandler } from './utils';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

describe('Seach and Display Results', () => {
  test('find-comedy-movie-saving-with-tom-hanks', () => {
    const { event, filter } = getEventAndFilter('find-comedy-movie-saving-with-tom-hanks.json');

    const expectFilter = (f) => {
      expect(f.titles).toEqual(['Saving', 'Saving You, Saving Me', 'Saving Hope', 'Saving Silverman']);
      expect(f.actors).toEqual(['Tom Hanks', 'Lloyd Hanks', 'Benjamin Hanks', 'Dannie Hanks', 'Megan Hanks']);
      expect(f.genres).toEqual(['Comedy', 'Comedy drama', 'Musical comedy', 'Romantic comedy']);
      ['collections', 'roles'].forEach(key => (
        expect(f[key]).toEqual([])
      ));
      expect(f.mediaType).toEqual('movie');
      ['season', 'episode'].forEach(key => (
        expect(f[key]).toBeNull()
      ));
    };

    expectFilter(filter);

    return checkHandler(event, expectFilter);
  });

  test('find-comedy-movie-saving', () => {
    const { event, filter } = getEventAndFilter('find-comedy-movie-saving.json');

    const expectFilter = (f) => {
      expect(f.titles).toEqual(['Saving', 'Saving You, Saving Me', 'Saving Hope', 'Saving Silverman']);
      expect(f.genres).toEqual(['Comedy', 'Comedy drama', 'Musical comedy', 'Romantic comedy']);
      ['collections', 'actors', 'roles'].forEach(key => (
        expect(f[key]).toEqual([])
      ));
      expect(f.mediaType).toEqual('movie');
      ['season', 'episode'].forEach(key => (
        expect(f[key]).toBeNull()
      ));
    };

    expectFilter(filter);

    return checkHandler(event, expectFilter);
  });
});
