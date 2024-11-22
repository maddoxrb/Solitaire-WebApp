// auth.js
'use strict';

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: 'Ov23li5gS5By6ZQkxxjE',
      clientSecret: '8de6ae0c8ef1762184faf489a45bf5be113b94d4',
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Check if the user already exists
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // If not, create a new user
          user = new User({
            username: profile.username,
            githubId: profile.id,
            first_name: profile.displayName || '',
            primary_email: profile.emails[0].value || '',
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
