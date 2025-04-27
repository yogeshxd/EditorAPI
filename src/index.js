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
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const videoRoutes = require('./routes/videoRoutes');

dotenv.config(); 
const prisma = new PrismaClient();

app.use(cors());
const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Video Editing Backend API",
        version: "1.0.0",
        description: "API for uploading, editing, and rendering videos using Node.js, Express.js, Prisma, and FFmpeg.",
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
    apis: ["./src/routes/*.js"],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  
app.use(express.json()); 
app.use(morgan('dev')); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`); 
});

