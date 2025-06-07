const express = require("express");
const session = require('express-session');
const path = require("path");
const gestureRoutes = require("./routes/gestureRoutes");
const authRoutes = require("./routes/authRoutes");
const aboutRoutes = require('./routes/aboutRoutes');



const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use(session({
    secret: process.env.SESSION_SECRET || '0c8eccddb63bb2f42b14de61ef1e5962e0a6699671cb3cccf6514eb4f477d675a69e6a4933ea29054bf27959ff91c7fe31f9381897d4472574b829c8ab9efc21',
    resave: false,
    saveUninitialized: true,
  }));  

// Routes
app.use("/", gestureRoutes);
app.use("/", authRoutes);
app.use(aboutRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.static('public'));
