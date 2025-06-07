const express = require('express');
const multer = require('multer');
const path = require('path');
const handController = require('../controllers/handController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });

// Route definitions
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index', { user: req.session.user });
});

router.post('/detect', ensureAuthenticated, upload.single('image'), handController.detectHand);

// Configuration routes
router.route('/config')
    .get(ensureAuthenticated, handController.renderUpdateRole)
    .post(ensureAuthenticated, handController.updateRole);

module.exports = router;
