import moxios from 'moxios';
import { handler } from '../src/index';
import { readEvent } from './utils';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

describe('Error handling', () => {
  test('Unreachable Kodi', () => {
    const event = readEvent('play-comedy-mean-girls.json');

    return new Promise((resolve, reject) => {
      handler(event, {}, (error, response) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }

        expect(response.event.payload.type).toEqual('ENDPOINT_UNREACHABLE');

        resolve();
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();

        request.respondWith({ status: 200, response: { status: 'error', error: 'unreachable_device' } });
      });
    });
  });

  test('Not found', () => {
    const event = readEvent('play-comedy-mean-girls.json');

    return new Promise((resolve, reject) => {
      handler(event, {}, (error, response) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }

        expect(response.event.payload.type).toEqual('NOT_SUBSCRIBED');

        resolve();
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();

        request.respondWith({ status: 200, response: { status: 'error', error: 'not_found' } });
      });
    });
  });
});
