import fs from 'fs';
import path from 'path';

import { handler } from '../index';

const event = JSON.parse(fs.readFileSync(path.join(path.resolve(__dirname), 'play-lord-of-the-rings.json')));

// const event = {
//   directive: {
//     endpoint: {
//       scope: {
//         type: 'BearerToken',
//         token: '333d66e96beb2a6ad64ac8522cfa690c3ac9f79c'
//       },
//       endpointId: 'videoDevice-001',
//       cookie: {
//       }
//     },
//     header: {
//       messageId: '5f2477e6-8f57-4606-af18-6990b8646794',
//       correlationToken: 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg==',
//       name: 'SearchAndPlay',
//       namespace: 'Alexa.RemoteVideoPlayer',
//       payloadVersion: '3'
//     },
//     payload: {
//       accessToken: 'd8e19ab72e3b6ea6c871bfeba60bb1b7da41c12e',
//       entities: [{
//         externalIds: {
//           gracenote: 'MV000000099001'
//         },
//         value: 'how i met mother',
//         type: 'Video'
//       }],
//       timeWindow: {
//         end: '2016-09-07T23:59:00+00:00',
//         start: '2016-09-01T00:00:00+00:00'
//       }
//     }
//   }
// };

handler(event, {}, (error, response) => {
  console.log('handler finished');
  console.log(error);
  console.log(JSON.stringify(response, null, '  '));
});
