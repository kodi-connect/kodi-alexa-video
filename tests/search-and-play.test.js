import moxios from 'moxios';

import { getEventAndFilter, checkHandler } from './utils';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

test('play-comedy-mean-girls', () => {
  const { event, filter } = getEventAndFilter('play-comedy-mean-girls.json');

  const expectFilter = (f) => {
    expect(f.titles).toEqual(['Mean Girls']);
    expect(f.genres).toEqual(['Comedy', 'Comedy drama', 'Musical comedy', 'Romantic comedy']);
    ['collections', 'actors', 'roles'].forEach(key => (
      expect(f[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(f[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-comedy-with-tom-hanks', () => {
  const { event, filter } = getEventAndFilter('play-comedy-with-tom-hanks.json');

  const expectFilter = (f) => {
    expect(f.genres).toEqual(['Comedy', 'Comedy drama', 'Musical comedy', 'Romantic comedy']);
    expect(f.actors).toEqual(['Tom Hanks', 'Lloyd Hanks', 'Benjamin Hanks', 'Dannie Hanks', 'Megan Hanks']);
    ['titles', 'collections', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-darth-vader-movies', () => {
  const { event, filter } = getEventAndFilter('play-darth-vader-movies.json');

  const expectFilter = (f) => {
    expect(f.roles).toEqual(['Darth Vader']);
    ['titles', 'collections', 'genres', 'actors'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    expect(f.mediaType).toBe('movie');
    ['season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-how-i-met-your-mother', () => {
  const { event, filter } = getEventAndFilter('play-how-i-met-your-mother.json');

  const expectFilter = (f) => {
    expect(f.titles).toEqual(['How I Met Your Mother', 'Goodbye How I Met Your Mother', 'How I Met Your Mother: Extras', 'How I Met Your Puppet Mother']);
    ['collections', 'genres', 'actors', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-mean-girls-with-lindsay-lohan', () => {
  const { event, filter } = getEventAndFilter('play-mean-girls-with-lindsay-lohan.json');

  const expectFilter = (f) => {
    expect(f.titles).toEqual(['Mean Girls']);
    expect(f.actors).toEqual(['Lindsay Lohan', 'Ali Lohan', 'Horst Lohan', 'Dina Lohan', 'Treison Lohan']);
    ['collections', 'genres', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-the-comedy-mean-girls-with-lindsay-lohan', () => {
  const { event, filter } = getEventAndFilter('play-the-comedy-mean-girls-with-lindsay-lohan.json');

  const expectFilter = (f) => {
    expect(f.titles).toEqual(['Girls']);
    expect(f.actors).toEqual(['Lindsay Lohan', 'Ali Lohan', 'Horst Lohan', 'Dina Lohan', 'Treison Lohan']);
    ['collections', 'genres', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-thor-with-chris-hemsworth', () => {
  const { event, filter } = getEventAndFilter('play-thor-with-chris-hemsworth.json');

  const expectFilter = (f) => {
    expect(f.collections).toEqual(['Thor']);
    expect(f.actors).toEqual(['Chris Hemsworth', 'Chelsie Hemsworth', 'Liam Hemsworth', 'Luke Hemsworth', 'Maria Hemsworth']);
    ['titles', 'genres', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('play-tv-show-the-orville', () => {
  const { event, filter } = getEventAndFilter('play-tv-show-the-orville.json');

  const expectFilter = (f) => {
    expect(f.titles).toEqual(['The Orville', 'Orville', 'The Orville Preview']);
    ['collections', 'genres', 'actors', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    expect(f.mediaType).toBe('tv show');
    ['season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('watch-jason-statham', () => {
  const { event, filter } = getEventAndFilter('watch-jason-statham.json');

  const expectFilter = (f) => {
    expect(f.actors).toEqual(['Jason Statham', 'Kyley Statham', 'Jake Statham', 'Tony Statham', 'Joe Statham']);
    ['titles', 'collections', 'genres', 'roles'].forEach(key => (
      expect(filter[key]).toEqual([])
    ));
    ['mediaType', 'season', 'episode'].forEach(key => (
      expect(filter[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});

test('watch-season-2-episode-7-of-how-i-met-your-mother', () => {
  const { event, filter } = getEventAndFilter('watch-season-2-episode-7-of-how-i-met-your-mother.json');

  const expectFilter = (f) => {
    expect(f.titles).toEqual(['How I Met Your Mother', 'Goodbye How I Met Your Mother', 'How I Met Your Mother: Extras', 'How I Met Your Puppet Mother']);
    ['collections', 'genres', 'actors', 'roles'].forEach(key => (
      expect(f[key]).toEqual([])
    ));
    expect(f.season).toEqual('2');
    expect(f.episode).toEqual('7');
    ['mediaType'].forEach(key => (
      expect(f[key]).toBeNull()
    ));
  };
  expectFilter(filter);

  return checkHandler(event, expectFilter);
});
