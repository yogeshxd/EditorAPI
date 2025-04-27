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
  const video = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!video) throw new Error('Video not found');

  // Save trim step
  await prisma.editStep.create({
    data: {
      videoId: video.id,
      type: 'trim',
      startTime: parseInt(start),
      endTime: parseInt(end),
    }
  });

  return { message: 'Trim step saved successfully' };
};

exports.addSubtitles = async (id, text, start, end) => {
  const video = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!video) throw new Error('Video not found');

  // Save subtitle step
  await prisma.editStep.create({
    data: {
      videoId: video.id,
      type: 'subtitle',
      text: text,
      startTime: parseInt(start),
      endTime: parseInt(end),
    }
  });

  return { message: 'Subtitle step saved successfully' };
};

exports.renderFinalVideo = async (id) => {
  const video = await prisma.video.findUnique({ where: { id: Number(id) }, include: { edits: true } });
  if (!video) throw new Error('Video not found');

  const tempOutputPath = video.path.replace(/(\.\w+)$/, `_temp$1`);

  let command = ffmpeg(video.path);

  // Apply all edit steps
  video.edits.forEach((step) => {
    if (step.type === 'trim') {
      command = command.setStartTime(step.startTime).setDuration(step.endTime - step.startTime);
    }
  });

  let drawtextFilters = [];
  video.edits.forEach((step) => {
    if (step.type === 'subtitle') {
      const fontPath = '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf'; // Adjust path based on your OS
      drawtextFilters.push(
        `drawtext=fontfile=${fontPath}:text='${step.text}':enable='between(t,${step.startTime},${step.endTime})':x=(w-text_w)/2:y=h-(text_h*3):fontsize=60:fontcolor=white`
      );
    }
  });

  if (drawtextFilters.length > 0) {
    command = command.videoFilter(drawtextFilters);
  }

  return new Promise((resolve, reject) => {
    command
      .output(tempOutputPath)
      .on('end', async () => {
        const final = await prisma.video.create({
          data: {
            name: tempOutputPath.split('/').pop(),
            path: tempOutputPath,
            duration: video.duration,
            size: fs.statSync(tempOutputPath).size,
            status: 'final'
          }
        });

        resolve(final);
      })
      .on('error', reject)
      .run();
  });
};

exports.getFinalVideo = async (id) => {
  const video = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (!video) throw new Error('Video not found');

  if (video.status !== 'final') {
    throw new Error('Video is not rendered yet.');
  }

  return {
    path: video.path,
    name: video.name
  };
};