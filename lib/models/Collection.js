const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String, 
    required: true
  }
});

schema.virtual('photos', {
  ref: 'Photo',
  localField: '_id',
  foreignField: 'collectionId',
});

module.exports = mongoose.model('Collection', schema);
