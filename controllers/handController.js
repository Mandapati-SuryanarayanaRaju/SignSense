const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const requestTracker = require('../services/requestTracker');

exports.detectHand = async (req, res) => {
    const user = req.session.user || null;
    if (!user) return res.redirect('/login');

    let usagePercentage = 0;
    try {
        let imagePath;
        let data = new FormData();

        usagePercentage = requestTracker.getUsagePercentage(user.id);
        requestTracker.trackRequest(user.id);

        if (requestTracker.getRemainingRequests(user.id) <= 0) {
            return res.render('result', { error: 'Monthly limit exceeded', result: null, imageUrl: null, user, usagePercentage });
        }

        // Handle uploaded image
        if (req.file) {
            imagePath = path.join(__dirname, '../public/uploads/', req.file.filename);
        } else if (req.body.imageData) {
            const base64Data = req.body.imageData.replace(/^data:image\/\w+;base64,/, '');
            imagePath = path.join(__dirname, '../public/uploads/', `camera_capture_${Date.now()}.jpg`);
            fs.writeFileSync(imagePath, base64Data, 'base64');
        } else {
            return res.render('result', { error: 'No image provided', result: null, imageUrl: null, user, usagePercentage });
        }

        if (!fs.existsSync(imagePath)) {
            return res.render('result', { error: 'File not found', result: null, imageUrl: null, user, usagePercentage });
        }

        // Use Buffer as fallback
        const fileBuffer = fs.readFileSync(imagePath);
        data.append('image', fileBuffer, {
            filename: path.basename(imagePath),
            contentType: 'image/jpeg'
        });

        // Debugging Logs
        console.log(`\ud83d\udce4 Sending image: ${imagePath}`);
        console.log(`\u2705 Image Path Exists:`, fs.existsSync(imagePath));
        console.log(`\ud83d\udccf File Size: ${fs.statSync(imagePath).size} bytes`);
        console.log("\ud83d\udce8 FormData Headers:", data.getHeaders());

        const headers = {
            'x-rapidapi-key': 'b6250e939dmsh2873d3d3148a07ep1e56f0jsn73e01dde31f6',
            'x-rapidapi-host': 'ppe-detection1.p.rapidapi.com',
            ...data.getHeaders(),
        };

        const response = await fetch('https://ppe-detection1.p.rapidapi.com/detect-ppe', {
            method: 'POST',
            headers: headers,
            body: data,
        });

        const result = await response.json();
        console.log("\ud83d\udce5 API Response:", JSON.stringify(result, null, 2));

        if (!result || !result.body || !result.body.Persons || result.body.Persons.length === 0) {
            return res.render('result', { error: 'No hands detected', result: null, imageUrl: null, user, usagePercentage });
        }

        res.render('result', {
            error: null,
            result: result.body.Persons,
            user,
            imageUrl: `/uploads/${path.basename(imagePath)}`,
            usagePercentage
        });

    } catch (error) {
        console.error("\u274c Error in detectHand function:", error);
        res.render('result', { error: 'Error processing image', result: null, imageUrl: null, user, usagePercentage });
    }
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

