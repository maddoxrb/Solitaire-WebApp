/* Copyright G. Hemingway, 2024 - All rights reserved */
'use strict';
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const env = process.env.NODE_ENV || 'dev';

const setupServer = async () => {
  const port = process.env.PORT || 8080;

  // Setup our Express pipeline
  const app = express();
  app.use(logger('dev'));
  app.engine('pug', require('pug').__express);
  app.set('views', __dirname);
  app.use(express.static(path.join(__dirname, '../../public')));

  // Setup pipeline session support
  app.store = session({
    name: 'session',
    secret: 'grahamcardrules',
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/' },
  });
  app.use(app.store);

  // Finish with the body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure the GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await app.models.User.findOne({ githubId: profile.id });
          if (!user) {
            // Create a new user based on GitHub profile
            user = new app.models.User({
              githubId: profile.id,
              username: profile.username.toLowerCase(),
              first_name: profile.displayName || '',
              primary_email:
                (profile.emails &&
                  profile.emails[0] &&
                  profile.emails[0].value) ||
                '',
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await app.models.User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB shutting down');
    });
    console.log(`MongoDB connected: ${process.env.MONGODB_URI}`);
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }

  // Import our Data Models
  app.models = {
    Game: require('./models/game.cjs'),
    Move: require('./models/move.cjs'),
    User: require('./models/user.cjs'),
  };

  // Import our routes
  require('./api/index.cjs')(app);

  // GitHub OAuth routes
  app.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
  );

  app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login',
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect(`/profile/${req.user.username}`);
    },
  );

  // Serve the SPA base page
  app.get('*', (req, res) => {
    const user = req.session.user;
    console.log(`Loading app for: ${user ? user.username : 'nobody!'}`);
    const preloadedState = user
      ? JSON.stringify({
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          primary_email: user.primary_email,
          city: user.city,
          games: user.games,
        }).replace(/</g, '\\u003c')
      : '{}';
    res.render('base.pug', { state: preloadedState });
  });

  // Run the server
  let server;
  if (env === 'production') {
    const options = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      ca: fs.readFileSync(process.env.SSL_CA_PATH),
    };
    server = https.createServer(options, app).listen(port, () => {
      console.log(`Secure server running on port: ${server.address().port}`);
    });
  } else {
    server = app.listen(port, () => {
      console.log(
        `Server running in ${env} mode on port: ${server.address().port}`,
      );
    });
  }
};

// Run the server
setupServer();
