// Entry point of the backend server

const express = require('express'); 
const app = express(); 
const dotenv = require('dotenv'); 
const morgan = require('morgan'); 
const cors = require('cors'); 
const { PrismaClient } = require('@prisma/client'); 
const multer = require('multer'); 
const path = require('path'); 
const fs = require('fs'); 
const ffmpeg = require('fluent-ffmpeg');

const videoRoutes = require('./routes/videoRoutes');

dotenv.config(); 
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`); 
});

