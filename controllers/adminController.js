const userModel = require('../models/userModel');

exports.adminPage = (req, res) => {
  const user = req.session.user || null;

  if (user.role === 'user') {
    return res.redirect('/');
  }

  userModel.getUsers((err, results) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }

    res.render('admin', { users: results, user });
  });
};
