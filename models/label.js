'use strict';

const db = require('./db.js');


function getLabels(imageId) {
  return db.getLabels(imageId);
}

function getLabel(imageId, x, y) {
  return db.getLabel(imageId, x, y)
}

function saveLabel(name, x, y, number, imageId) {
  return db.saveLabel(name,
               x,
               y,
               number,
               imageId);
}

function updateLabel(name, id) {
  return db.updateLabel(name, id);
}

module.exports = { getLabels, saveLabel, updateLabel, getLabel }
