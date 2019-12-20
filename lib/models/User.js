const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: true
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
  //second argument of hasSync determines how many cycles it will go through to waste time
  this.passwordHash = bcrypt.hashSync(password, 10);
});

//takes whatever the user has input (which is an object) and authenticates if the user exists by the user query
//query middleware
schema.statics.authenticate = async function({ email, password }) {
  //see if we can find a user
  const user = await this.findOne({ email });
  //no user? throw an error of a specific status
  if(!user) {
    const err = new Error('invalid email or password');
    err.status = 401;
    throw err;
  }

  //check if the password is valid
  //if use compare then need to use await!!! 
  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if(!validPassword) {
    const err = new Error('invalid email or password');
    err.status = 401;
    throw err;
  }
  return user;
};

//instance method because we already know that the user exists and has signed in! So this needs to be used for every instance of a signed-in user
schema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET || 'A_SECRET', {
    expiresIn: '24h'
  });
};

module.exports = mongoose.model('User', schema);
