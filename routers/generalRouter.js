'use strict';

const express = require('express');
const controller = require('../controllers/generalController.js');
var router = express.Router();

router.get('/contents', controller.getAllThemes);

router.get('/labels/:imageId', controller.getLabels);

router.get('/pages/:contentId', controller.getImageIds);

router.get('/pages/:contentId/image/:imageId', controller.getImageData);

router.get('/words/:contentId/:imageId/:objectX/:objectY', controller.getLabel);

module.exports = router;
