module.exports = function (err, req, res, next) {
  // Log the execption
  res.status(500).send('Something failed');
};