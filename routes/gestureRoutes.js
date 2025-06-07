const express = require("express");
const multer = require("multer");
const gestureController = require("../controllers/gestureController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Route to display the index page
router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index", { user: req.user });
});

// Route to process image submission
router.post(
    "/result",
    ensureAuthenticated,
    upload.single("image_file"),
    gestureController.analyzeGesture
);

// Route for profile (fixes login redirection issue)
router.get('/profile', (req, res) => {
    console.log("User data:", req.session.user); // Debugging
    res.render('profile', { user: req.session.user });
});



module.exports = router;
