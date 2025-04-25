const videoService = require('../services/videoService');

exports.uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await videoService.saveVideo(file);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

exports.trimVideo = async (req, res) => {
    const { id } = req.params;
    const { start, end } = req.body;
  
    try {
      const trimmed = await videoService.trimVideo(id, start, end);
      res.json(trimmed);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Trimming failed' });
    }
  };