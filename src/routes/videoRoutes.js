const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const videoController = require('../controllers/videoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Route to upload video
router.post('/upload', upload.single('video'), videoController.uploadVideo);

// Route to trim video
router.post('/:id/trim', videoController.trimVideo);

// Route to subtitle overlay
router.post('/:id/subtitles', videoController.addSubtitles);

module.exports = router;