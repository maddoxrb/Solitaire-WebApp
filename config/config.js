require('dotenv').config();

module.exports = {
  url: 'http://localhost',
  api_version: '/v1',
  mongodb: 'mongodb://localhost:27017/barromr4',
  port: 8080,
  environments: {
    test: {
      mongodb: 'mongodb://localhost:27017/testing',
      port: 8081,
    },
    ci: {
      mongodb: 'mongodb://127.0.0.1:27017/testing',
    },
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
};
