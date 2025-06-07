# SignSense: AI Hand Gesture-Based Language Interpreter  

## 🚀 Introduction  
**SignSense** is an advanced AI-powered hand gesture-based language interpreter built with **Node.js, Express, Tailwind CSS, and MySQL**. It enables users to **translate hand gestures** into text, allowing seamless communication for those with hearing impairments. The platform also features **role-based access control** to manage different user permissions.   

## 🎯 Features  
- **Hand Gesture Recognition** – Translate hand gestures into text using AI-powered models.  
- **Real-Time Translation** – Provides instant feedback as users perform gestures.  
- **Role-Based Access Control** – Different user roles with varying permissions.  
- **Responsive UI** – Built with **Tailwind CSS** for a sleek and adaptive design. 

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js  
- **Frontend:** Tailwind CSS, Alpine.js  
- **Database:** MySQL  
- **Authentication & Roles:** Csurf, Express Session  

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/yourusername/signsense.git  
cd signsense
```

### 2️⃣ Setup Database Credentials
```sh
const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'databasename',
  })
  .promise();

module.exports = db;
```

### 3️⃣ Setup Database
```sh
-- Create the 'users' table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4️⃣ Start the Server
```sh
node app.js
```
