const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(fileUpload());
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

// Serve static files from the 'client' directory
app.use(express.static('client'));

// Route to serve uploaded files dynamically
app.get('/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const uploadsDir = path.join(__dirname, 'uploads');
  const filePath = path.join(uploadsDir, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.sendFile(filePath);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
