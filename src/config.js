const config = {
  kodiConnectUrl: process.env.KODI_CONNECT_URL || 'https://kodiconnect.kislan.sk',

  awsRegion: (process.env.AWS_REGION || process.env.DEFAULT_AWS_REGION || 'us-east-1').split('-')[0],
};

export default config;
