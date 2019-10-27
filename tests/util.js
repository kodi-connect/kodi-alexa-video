const moxios = require('moxios');

const { handler } = require('../src');

function moxiosGetRequest() {
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

function asyncHandler(event, context) {
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

exports.moxiosGetRequest = moxiosGetRequest;
exports.asyncHandler = asyncHandler;
