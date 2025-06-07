const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController'); 
const adminController = require('../controllers/adminController'); 
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', authController.register);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/profile', ensureAuthenticated, profileController.getProfile);
router.get('/admin', ensureAuthenticated, adminController.adminPage);

// settings
router.get('/config', ensureAuthenticated, profileController.renderUpdateRole);
router.post('/config', ensureAuthenticated, profileController.updateRole);

// Forgot & Reset Password
router.get("/forgot-password", authController.renderForgotPassword);

router.post("/forgot-password", authController.handleForgotPassword);
router.get("/reset-password/:token", authController.renderResetPassword);
router.post("/reset-password/:token", authController.handleResetPassword);



module.exports = router;