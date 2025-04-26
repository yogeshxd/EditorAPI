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

exports.addSubtitles = async (id, text, start, end) => {
  const original = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!original) throw new Error('Video not found');

  const outputPath = original.path.replace(/(\.\w+)$/, `_subtitled$1`);
  const fontPath = '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf'; // Adjust based on your OS

  return new Promise((resolve, reject) => {
    ffmpeg(original.path)
    .videoFilter(`drawtext=fontfile=${fontPath}:text='${text}':enable='between(t,${start},${end})':x=(w-text_w)/2:y=h-(text_h*3):fontsize=60:fontcolor=white`)
      .output(outputPath)
      .on('end', async () => {
        const subtitled = await prisma.video.create({
          data: {
            name: path.basename(outputPath),
            path: outputPath,
            duration: original.duration,
            size: fs.statSync(outputPath).size,
            status: 'subtitled'
          }
        });
        resolve(subtitled);
      })
      .on('error', reject)
      .run();
  });
};

exports.renderFinalVideo = async (id) => {
  const source = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!source) throw new Error('Video not found');

  const finalPath = source.path.replace(/(\.\w+)$/, `_final$1`);

  return new Promise((resolve, reject) => {
    ffmpeg(source.path)
      .output(finalPath)
      .on('end', async () => {
        const final = await prisma.video.create({
          data: {
            name: path.basename(finalPath),
            path: finalPath,
            duration: source.duration,
            size: fs.statSync(finalPath).size,
            status: 'final'
          }
        });
        resolve(final);
      })
      .on('error', reject)
      .run();
  });
};