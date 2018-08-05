const Joi = require('joi');
const mongoose = require('mongoose');

const genereSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model('Genre', genereSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genereSchema = genereSchema;
exports.validate = validateGenre;