const { Router } = require('express');
const User = require('../models/User'); 
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          maxAge: 24 * 60 * 60 * 1000
        });
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        res.cookie('session', user.authToken(), {
          maxAge: 24 * 60 * 60 * 1000
        });
        res.send(user);
      })
      .catch(next);
  })

  // eslint-disable-next-line no-unused-vars
  .get('/verify', ensureAuth, (req, res, next) => {
    res.send(req.user);
  });
