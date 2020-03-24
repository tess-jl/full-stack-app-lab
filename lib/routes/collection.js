//every route where we want to make sure the user is signed in will implement the ensureAuth middleware 
const { Router } = require('express');
const Collection = require('../models/Collection');
const Photo = require('../models/Photo');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res) => {
    Collection
      .create(req.body)
      .then(collection => res.send(collection));
  });

  // .get('/', (req, res) => {
  //   Collection
  //     .find()
  //     .select({ name: true })
  //     .then(collections => res.send(collections));
  // })

  // // .get('/:id', (req, res) => {
  // //   Collection
  // //     .findById(req.params.id)
  // //     .populate('photos')
  // //     .then(collection => 
  // //       Promise.all(collection
  // //         .toJSON({ virtuals: true }).itineraryItems
  // //         // .map(item => item.populateWeather()))
  // //         .then(weathers => weathers.map((item, i) => ({ ...item, weather: weathers[i] })))
  // //         .then(itineraryItems => res.send({ ...photo.toJSON(), itineraryItems })));
  // // })

  // .patch('/:id', (req, res) => {
  //   Collection
  //     .findByIdAndUpdate(req.params.id, req.body, { new: true })
  //     .then(collection => res.send(collection));
  // })

  // .delete('/:id', (req, res) => {
  //   Promise.all([
  //     Collection.findByIdAndDelete(req.params.id),
  //     Photo.deleteMany({ collectionId: req.params.id })
  //   ])
  //     .then(([collection]) => res.send(collection));
  // });

