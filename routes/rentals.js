const { Rental, validate } = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
    return res.status(400).send('Invalid Customer');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid custormer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
 
  try {
    /* We can use:
       Promise.all([promise1, promise2])
        .then(() => {
          // to execute task3 when promise1, and promise2 both has resolved.
        });

      or Promise.race([promise1, promise2])
          .then(() => {
            // to execute task3 when any of the above promise has resolved.
          });
    */
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {
        _id: movie._id
      }, {
        $inc: {
          numberInStock: -1
        }
      }).run();
  } catch (ex) {
    res.status(500).send('Something failed');
  }

  /*rental = await rental.save();
  movie.numberInStock--;
  movie.save();*/

  res.send(rental);
});

module.exports = router;