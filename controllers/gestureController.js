const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Convert buffer to base64
function bufferToBase64(buffer) {
  return buffer.toString("base64");
}

async function analyzeGesture(req, res) {
  if (!req.file) {
    return res.render("index", { user: req.user, result: "No image uploaded!" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = "Analyze this image and recognize the number or sign shown by the hand gesture and in that dont generate * symbol.";

    const imageBase64 = bufferToBase64(req.file.buffer);

    const imagePart = {
      inline_data: {
        data: imageBase64,
        mime_type: "image/jpeg",
      },
    };

    // AI Response
    const response = await model.generateContent([prompt, imagePart]);
    let result = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Gesture not recognized.";

    // Truncate result if it exceeds 200 characters
    if (result.length > 200) {
      result = result.substring(0, 197) + "...";
    }

    // Save uploaded image to public folder
    const imageDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const imageFilename = `gesture_${Date.now()}.jpg`;
    const imagePath = path.join(imageDir, imageFilename);
    fs.writeFileSync(imagePath, req.file.buffer);

    const imageUrl = `/uploads/${imageFilename}`;

    // Call Text-to-Speech API
    const ttsUrl = "https://text-to-speach-api.p.rapidapi.com/text-to-speech";
    const ttsOptions = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "c61d2a41e6msha677143a858cee4p1bd26ejsn166a6ee3f3ef",
        "x-rapidapi-host": "text-to-speach-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: result,
        lang: "en",
        speed: "slow",
      }),
    };

    const ttsResponse = await fetch(ttsUrl, ttsOptions);

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error("TTS API Error:", errorText);
      throw new Error("Failed to generate speech");
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    // Ensure audio directory exists
    const audioDir = path.join(__dirname, "../public/audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Save audio file
    const audioFilename = `gesture_audio_${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, audioFilename);
    fs.writeFileSync(audioPath, audioBuffer);

    const audioUrl = `/audio/${audioFilename}`;

    res.render("result", { user: req.user, result, audioUrl, imageUrl });
  } catch (error) {
    console.error("Error:", error);
    res.render("index", { user: req.user, result: "Failed to analyze image." });
  }
}

module.exports = { analyzeGesture };
