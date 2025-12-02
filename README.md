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

### 0️⃣ Prerequisites  
- **Node.js 18+** (includes npm)  
- **MySQL 8+** running locally or accessible via network  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/yourusername/signsense.git  
cd signsense
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file in the project root (same level as `app.js`) and add the following keys:

```
PORT=3000
RAPIDAPI_KEY=replace-with-rapidapi-key
GEMINI_API_KEY=replace-with-google-gemini-key
```

- `PORT` – HTTP port Express listens on.  
- `RAPIDAPI_KEY` – authentication token for RapidAPI calls.  
- `GEMINI_API_KEY` – Google Generative AI key used in `controllers/gestureController.js`.  

> ℹ️ Database credentials currently live in `config/db.js`. Update that file if your MySQL host/user/password differ.

### 4️⃣ Setup Database
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

### 5️⃣ Start the Server
```sh
node app.js
```
