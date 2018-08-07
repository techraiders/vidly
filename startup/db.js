const mongoose = require('mongoose');
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