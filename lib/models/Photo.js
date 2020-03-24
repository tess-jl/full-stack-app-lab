const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true
  },
  favorite: {
    type: Boolean,
    required: true
  },
  notes: {
    type: String
  }, 
  location: {
    type: String, 
  }
});

module.exports = mongoose.model('Photo', schema);
