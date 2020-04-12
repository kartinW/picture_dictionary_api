'use strict';

const db = require('./db.js');


function getImageIds(imageId) {
  return db.getImageIds(imageId);
}

function getImageData(imageId) {
  return db.getImageData(imageId);
}

function saveImageMetaData(themeId) {
  return db.saveImage(themeId);
}

function saveImageData(imageId, imageFile) {
  return db.saveImageToDB(imageId, imageFile);
}


module.exports = { getImageIds, saveImageMetaData, saveImageData }
