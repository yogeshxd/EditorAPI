/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management API
 */

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
/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: Upload a video file
 *     tags: [Videos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 */
router.post('/upload', upload.single('video'), videoController.uploadVideo);

// Route to trim video
/**
 * @swagger
 * /api/videos/{id}/trim:
 *   post:
 *     summary: Save trimming step for a video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: integer
 *               end:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Trim step saved successfully
 */
router.post('/:id/trim', videoController.trimVideo);

// Route to subtitle overlay
/**
 * @swagger
 * /api/videos/{id}/subtitles:
 *   post:
 *     summary: Save subtitle overlay step for a video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               start:
 *                 type: integer
 *               end:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Subtitle step saved successfully
 */
router.post('/:id/subtitles', videoController.addSubtitles);

// Route to render final video
/**
 * @swagger
 * /api/videos/{id}/render:
 *   post:
 *     summary: Render final edited video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Final video rendered successfully
 */
router.post('/:id/render', videoController.renderFinalVideo);

// Route to download video
/**
 * @swagger
 * /api/videos/{id}/download:
 *   get:
 *     summary: Download final edited video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Final video file download
 */
router.get('/:id/download', videoController.downloadFinalVideo);

module.exports = router;