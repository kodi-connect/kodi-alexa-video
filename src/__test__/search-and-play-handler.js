import fs from 'fs';
import path from 'path';

import { handler } from '../index';

const event = JSON.parse(fs.readFileSync(path.join(path.resolve(__dirname), 'play-lord-of-the-rings.json')));

handler(event, {}, (error, response) => {
  console.log('handler finished');
  console.log(error);
  console.log(JSON.stringify(response, null, '  '));
});
