const User = require('../models/User');

module.exports = (req, res, next) => {
  // get session cookie
  const token = req.cookies.session;
  // use findByToken to get user
  User
    .findByToken(token)
    .then(user => {
      // set req.user = found user
      req.user = user;
      next();
    })
    .catch(next);
};
