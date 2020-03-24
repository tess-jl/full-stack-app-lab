const { Router } = require('express');
// const Trip = require('../models/Trip');
const Photo = require('../models/Photo');


module.exports = Router()
  .post('/', (req, res) => {
    Photo
      .create({ ...req.body })
      .then(item => res.send(item));
  })

  .delete('/:id', (req, res) => {
    Photo
      .findByIdAndDelete(req.params.id)
      .then((item) => res.send(item));
  });
