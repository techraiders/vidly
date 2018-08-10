const mongoose = require('mongoose');
// mongoose.Promise = global.Promise; plug in your own promise library like bluebird, q, or ES6 native promise into mongoose, because mongoose's default promise library is deprecated.
const config = require('config');

module.exports = function () {
  const db = config.get('db');
  mongoose.connect(db)
  .then(() => console.log(`Connected to ${db}...`));
  //.catch(err => console.error('Could not connect to MongoDB...'));
};

/*
  Run 'export NODE_ENV=envName' to change the environment on your MAC
  Run 'set NODE_ENV=envName' to change the environment on your PC
*/