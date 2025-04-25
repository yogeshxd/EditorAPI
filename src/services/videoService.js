const ffmpeg = require('fluent-ffmpeg');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.saveVideo = (file) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file.path, async (err, metadata) => {
      if (err) return reject(err);

      const video = await prisma.video.create({
        data: {
          name: file.filename,
          path: file.path,
          duration: Math.floor(metadata.format.duration),
          size: file.size,
          status: 'uploaded'
        }
      });

      resolve(video);
    });
  });
};