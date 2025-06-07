const userModel = require('../models/userModel');

exports.getProfile = (req, res) => {
  const userId = req.session.user.id;
  const userSession = req.session.user;

  if (!userId) {
    return res.redirect('/login');
  }

  userModel.findUserById(userId, (err, results) => {
    if (err || results.length === 0) {
      return res.redirect('/login');
    }

    const user = results[0];
    res.render('profile', { user: userSession });
  });
};

exports.renderUpdateRole = (req, res) => {
  res.render('updateRole', { user: req.session.user });
};

exports.updateRole = (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
      return res.status(400).send("Invalid role selected");
  }
  
  req.session.user.role = role;
  res.redirect('/config');
};