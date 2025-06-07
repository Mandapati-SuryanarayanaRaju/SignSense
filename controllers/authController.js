const db = require("../config/db"); // or your DB config
const bcrypt1 = require("bcryptjs");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.register = (req, res) => {
  const { name, phone, email, password, gender, location } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);

  userModel.registerUser(name, phone, email, hashedPassword, gender, location, (err) => {
    if (err) {
      console.error(err);
      res.redirect('/register?error=Registration failed');
    } else {
      res.redirect('/login');
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.redirect('/login?error=Invalid credentials');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.redirect('/login?error=Invalid credentials');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      location: user.location
    };
    
    req.session.userId = user.id; 

    req.session.save((err) => {
      if (err) {
        return res.redirect('/login?error=Session not saved');
      }
      res.redirect('/');
    });
  });
};

exports.getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      callback(null, results[0]); 
    } else {
      callback(null, null); 
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};


exports.renderForgotPassword = (req, res) => {
  res.render("forgot-password");
};

exports.handleForgotPassword = (req, res) => {
  const email = req.body.email;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000); // 1 hour

  const query = "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?";
  db.query(query, [token, expiry, email], (err, result) => {
    if (err) throw err;
    // Simulate email
    console.log(`Reset link: http://localhost:3000/reset-password/${token}`);
    res.send("Reset link has been sent to your email (console for demo).");
  });
};

exports.renderResetPassword = (req, res) => {
  res.render("reset-password", { token: req.params.token });
};

exports.handleResetPassword = (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.password;

  const query = "SELECT * FROM users WHERE reset_token=? AND reset_token_expiry > NOW()";
  db.query(query, [token], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send("Invalid or expired token.");

    const hashed = await bcrypt1.hash(newPassword, 10);
    const update = "UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?";
    db.query(update, [hashed, results[0].id], (err2) => {
      if (err2) throw err2;
      res.send("Password reset successful.");
    });
  });
};