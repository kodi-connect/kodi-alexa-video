import { getFilterFromEventFile } from './utils';

test('find-comedy-movie-saving-with-tom-hanks', () => {
  const filter = getFilterFromEventFile('find-comedy-movie-saving-with-tom-hanks.json');

  expect(filter.titles).toEqual(['Saving', 'Saving You, Saving Me', 'Saving Hope', 'Saving Silverman']);
  expect(filter.actors).toEqual(['Tom Hanks', 'Lloyd Hanks', 'Benjamin Hanks', 'Dannie Hanks', 'Megan Hanks']);
  expect(filter.genres).toEqual(['Comedy', 'Comedy drama', 'Musical comedy', 'Romantic comedy']);
  ['collections', 'roles'].forEach(key => (
    expect(filter[key]).toEqual([])
  ));
  expect(filter.mediaType).toEqual('movie');
  ['season', 'episode'].forEach(key => (
    expect(filter[key]).toBeNull()
  ));
});

test('find-comedy-movie-saving', () => {
  const filter = getFilterFromEventFile('find-comedy-movie-saving.json');

  expect(filter.titles).toEqual(['Saving', 'Saving You, Saving Me', 'Saving Hope', 'Saving Silverman']);
  expect(filter.genres).toEqual(['Comedy', 'Comedy drama', 'Musical comedy', 'Romantic comedy']);
  ['collections', 'actors', 'roles'].forEach(key => (
    expect(filter[key]).toEqual([])
  ));
  expect(filter.mediaType).toEqual('movie');
  ['season', 'episode'].forEach(key => (
    expect(filter[key]).toBeNull()
  ));
});
