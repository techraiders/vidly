const { Movie, validate } = require('../models/movie'),
  { Genre } = require('../models/genre'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // multer executes these function whenever a new file is received
      cb(null, './public/uploads/images');
    },
    filename: (req, file, cb) => {
      // multer executes these function whenever a new file is received
      cb(null, file.originalname);
      // cb(null, new Date().toISOString() + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // accepts a file
    } else {
      cb(null, false); // reject a file
    }
  };

  // upload = multer({dest: 'public/uploads/images'});
  upload = multer({storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
  });
  
  express = require('express'),
  router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post('/banner', upload.single('banner'), (req, res) => {
  console.log('req body is: ', req.body);
  console.log('banner is: ', req.file);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();
  res.status(200).send({
    status: 'ok',
    statusCode: 200,
    message: 'Movies was saved successfully',
    id: movie._id,
  });
});

module.exports = router;
