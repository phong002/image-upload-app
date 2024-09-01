const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/list', fileController.listFiles);
router.post('/upload', fileController.upload);
router.get('/download/:id', fileController.download);
router.post('/transcode/:id', fileController.transcode);
router.delete('/remove-all', fileController.removeAllImages); 

module.exports = router;
