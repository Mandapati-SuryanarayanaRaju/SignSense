function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {  // If using Passport.js
      return next();
  }
  res.redirect('/login');
}
