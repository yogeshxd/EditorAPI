# 🎬 Video Editing Backend API

![Node.js](https://img.shields.io/badge/Node.js-16.x-brightgreen)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-blue)

---

## 📋 About the Project

This project was developed as part of a **technical assignment for a backend developer position**.  
The task was to create a **modular, scalable backend service** for a **web-based video editing platform** using Node.js, Express, PostgreSQL, and FFmpeg.

> ⚠ **Note**:  
> This is a **prototype** designed to demonstrate backend architecture, API design, and video processing using FFmpeg.  
> It is **not** fully production-ready. Improvements like authentication, rate-limiting, input sanitization, background queues, and error resilience would be needed for real-world deployment.

---

## 🚀 Tech Stack

- **Node.js** (v16.x)
- **Express.js** (v4.x)
- **PostgreSQL** with **Prisma ORM**
- **FFmpeg** (for video processing)
- **Multer** (file uploads)
- **Swagger** (optional API docs)

---

## 🎯 Features

- Upload videos
- Trim videos by selecting start and end timestamps
- Add subtitles overlay (text appearing between specific timestamps)
- Render and save the final video
- Download final edited videos

---

## 🏗 Project Structure

```
/src
├── controllers/
├── routes/
├── services/
├── index.js
/prisma/
├── schema.prisma
/uploads/
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yogeshxd/EditorAPI.git
cd EditorAPI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file:
```env
DATABASE_URL="postgresql://<your-db-username>@localhost:5432/videoeditor"
```

### 4. Setup PostgreSQL Database
```bash
sudo systemctl start postgresql
sudo -iu postgres
createdb videoeditor
exit
```

Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the server
```bash
npm run dev   # if using nodemon
```
#### OR
```bash
node src/index.js
```

Server will start at: `http://localhost:5000`

---

## 🔥 API Endpoints

| Method | Endpoint                   | Description                     |
|--------|-----------------------------|---------------------------------|
| POST   | `/api/videos/upload`         | Upload a video file             |
| POST   | `/api/videos/:id/trim`        | Trim a video                    |
| POST   | `/api/videos/:id/subtitles`   | Add subtitles to a video        |
| POST   | `/api/videos/:id/render`      | Render the final edited video   |
| GET    | `/api/videos/:id/download`    | Download the final edited video |

---

## 📢 Important Notes

- **FFmpeg** must be installed and globally available. (`ffmpeg --version` should work.)
- All video files are stored **locally** under the `/uploads` directory.
- No authentication or access control is implemented.
- Background jobs, retry handling, and async queues are **not included** but can be added.

---

## 📹 Demo

You can view the demo video walkthrough [here](https://youtu.be/SDcUdMy0hdM).

---

## ✍️ Author

- [Yogesh Gupta](https://github.com/yogeshxd)
