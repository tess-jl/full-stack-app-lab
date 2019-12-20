const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: [true, 'Email is taken']
  }, 
  passwordHash: {
    type: String, 
    required: true
  }

}, 
{

  toJSON: {
    transform: (document, returned) => {
      delete returned.passwordHash;
    }
  }

});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
});

//model middleware
schema.statics.findByToken = function(token) {
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: tokenPayload._id,
      email: tokenPayload.email,
      __v : tokenPayload.__v
    }));
  }
  catch(err) {
    return Promise.reject(err);
  }
};


schema.statics.authenticate = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user) {
    const err = new Error('invalid email or password');
    err.status = 401;
    throw err;
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('invalid email or password');
    err.status = 401;
    throw err;
  }
  return user;
};

schema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET || 'A_SECRET', {
    expiresIn: '24h'
  });
};

module.exports = mongoose.model('User', schema);
