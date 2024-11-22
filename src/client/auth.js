'use strict';

const express = require('express');
const router = express.Router();
const passport = require('../auth');

// Initiate GitHub authentication
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

// Handle the callback
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github/failure' }),
  function (req, res) {
    res.status(200).send();
  },
);

// Authentication failed
router.get('/auth/github/failure', function (req, res) {
  res.status(400).send();
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
