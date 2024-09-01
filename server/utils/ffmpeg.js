const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

exports.transcode = (inputPath, callback) => {
  const outputPath = path.join(path.dirname(inputPath), 'transcoded_' + path.basename(inputPath));

  ffmpeg(inputPath)
    .output(outputPath)
    .on('end', () => callback(null, outputPath))
    .on('error', (err) => callback(err))
    .run();
};
