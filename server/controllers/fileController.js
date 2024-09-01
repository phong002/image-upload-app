const fs = require('fs');
const path = require('path');
const ffmpeg = require('../utils/ffmpeg');
const filesDbPath = path.join(__dirname, '../data/files.json');
const uploadsDir = path.join(__dirname, '../uploads');

// Helper function to read files.json dynamically
function readFilesDb() {
  try {
    const data = fs.readFileSync(filesDbPath, 'utf8');
    console.log('Reading files.json:', data);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading files.json:', err);
    return [];
  }
}

// Helper function to write to files.json dynamically
function writeFilesDb(data) {
  try {
    fs.writeFileSync(filesDbPath, JSON.stringify(data, null, 2));
    console.log('Writing to files.json:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to files.json:', err);
  }
}

exports.upload = (req, res) => {
  console.log('Upload endpoint hit');

  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files were uploaded.');
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  console.log('File received:', file.name);

  // Set the initial upload path
  let uploadPath = path.join(uploadsDir, file.name);

  // Check if a file with the same name already exists
  if (fs.existsSync(uploadPath)) {
    // Generate a unique file name by appending a timestamp
    const fileExtension = path.extname(file.name);
    const fileNameWithoutExt = path.basename(file.name, fileExtension);
    const uniqueSuffix = Date.now();
    const uniqueFileName = `${fileNameWithoutExt}_${uniqueSuffix}${fileExtension}`;
    uploadPath = path.join(uploadsDir, uniqueFileName);

    console.log('File with the same name already exists. New file name:', uniqueFileName);
  }

  // Move the file to the upload directory
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).send(err);
    }

    console.log('File moved successfully:', uploadPath);

    // Read the current files database dynamically
    const filesDb = readFilesDb();
    filesDb.push({ id: filesDb.length + 1, name: path.basename(uploadPath), path: uploadPath });
    writeFilesDb(filesDb);

    res.json({ message: 'File uploaded successfully', file: path.basename(uploadPath) });
  });
};

exports.listFiles = (req, res) => {
  const files = readFilesDb();
  res.json(files);
};

// Remove all images
exports.removeAllImages = (req, res) => {
  console.log('Remove all images endpoint hit.');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).json({ message: 'Error reading uploads directory' });
    }

    console.log(`Found ${files.length} files in uploads directory.`);

    if (files.length === 0) {
      // If no files to delete, clear files.json and respond
      return clearFilesJson(res);
    }

    let filesDeleted = 0;
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting file ${file}:`, err);
          return res.status(500).json({ message: `Error deleting file ${file}` });
        }

        console.log(`File deleted successfully: ${filePath}`);
        filesDeleted++;
        if (filesDeleted === files.length) {
          // Once all files are deleted, clear the files.json
          clearFilesJson(res);
        }
      });
    });
  });
};

// Helper function to clear files.json
function clearFilesJson(res) {
  writeFilesDb([]);
  console.log('files.json cleared successfully.');
  res.json({ message: 'All images removed successfully.' });
}

exports.download = (req, res) => {
  const filesDb = readFilesDb();
  const file = filesDb.find(f => f.id == req.params.id);
  if (!file) return res.status(404).send('File not found');

  res.download(file.path, file.name);
};

exports.transcode = (req, res) => {
  const filesDb = readFilesDb();
  const file = filesDb.find(f => f.id == req.params.id);
  if (!file) return res.status(404).send('File not found');

  ffmpeg.transcode(file.path, (err, outputPath) => {
    if (err) return res.status(500).send('Error transcoding file');

    res.json({ message: 'File transcoded successfully', path: outputPath });
  });
};
