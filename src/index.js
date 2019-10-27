const axios = require('axios');

const KODI_CONNECT_URL = process.env.KODI_CONNECT_URL || 'https://kodiconnect.kislan.sk';
const VERSION = '<version>';

exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event, null, '  '));

  const data = {
    alexaRequest: {
      event,
      context,
    },
    meta: {
      region: (process.env.AWS_REGION || process.env.DEFAULT_AWS_REGION || 'us-east-1'),
      version: VERSION,
    },
  };

  axios({
    method: 'POST',
    url: `${KODI_CONNECT_URL}/alexa`,
    data,
  }).then((response) => {
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, '  '));
    callback(null, response.data);
  }, (error) => {
    console.error('Handler failed:', error.message);
    callback(error);
  });
};
