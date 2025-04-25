const ffmpeg = require('fluent-ffmpeg');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const path = require('path');
const fs = require('fs');

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


exports.trimVideo = async (id, start, end) => {
  const original = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!original) throw new Error('Video not found');

  const trimmedPath = original.path.replace(/(\.\w+)$/, `_trimmed$1`);

  return new Promise((resolve, reject) => {
    ffmpeg(original.path)
      .setStartTime(start)
      .setDuration(end - start)
      .output(trimmedPath)
      .on('end', async () => {
        const trimmed = await prisma.video.create({
          data: {
            name: path.basename(trimmedPath),
            path: trimmedPath,
            duration: end - start,
            size: fs.statSync(trimmedPath).size,
            status: 'trimmed'
          }
        });
        resolve(trimmed);
      })
      .on('error', reject)
      .run();
  });
};