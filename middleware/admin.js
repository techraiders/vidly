module.exports = function (req, res, next) {
  // 401 Unauthorized i.e user is not recognized
  // 403 Forbidded i.e user doesn't have permission
  if (!req.user.isAdmin) return res.status(403).send('Access denied');
  next();
};