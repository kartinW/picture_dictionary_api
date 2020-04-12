var express = require('express');
const controller = require('../controllers/adminController.js');

var router = express.Router();

router.post('/theme', controller.saveTheme);

router.post('/image/:contentId', controller.saveImageData);

router.put('/image/:imageId', controller.updateImageData);

router.post('/label', controller.saveLabel);

router.put('/label', controller.updateLabel);

module.exports = router;
