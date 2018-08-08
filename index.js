require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

process.on('uncaughtException', (ex) => {
  console.log('WE GOT AN UNCAUGHT EXCEPTION: ');
  console.log(ex.message, ex);
  process.exit(1); // process is in uncleaned state, so should exit and restart.
});

process.on('unhandledRejection', ex => {
  console.log('WE GOT AN UNHANDLED PROMISE REJECTION: ');
  console.log(ex.message, ex);
  process.exit(1); // process is in uncleaned state, so should exit and restart.
});

// const p = Promise.reject(new Error('Rejected promise threw error'));
// p.then(() => console.log('DONE'));

//throw new Error('Something failed before connecting to MongoDB');


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;