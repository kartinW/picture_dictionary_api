'use strict';


const theme = require('../models/theme.js');
const label = require('../models/label.js');
const image = require('../models/image.js');

function getAllThemes(request, response) {
  theme.getAllThemes()
  .then(x => response.json(x))
  .catch(e => {
    console.log(e);
    response.status(500).send('The themes could not be retrieved.');
  });
}

function getLabels(request, response)  {
  let imageId = request.params.imageId;
  label.getLabels(imageId)
  .then(x => response.json(x))
  .catch(e => response.status(500).send('The labels could not be retrieved.'));
}

function getImageIds(request, response)  {
  let contentId = Number(request.params.contentId);
  image.getImageIds(contentId)
  .then(x => response.json(x.map(y => y.id)))
  .catch(e => response.status(404).send('No images were found for the content.'));
}

function getImageData(request, response) {
  let date = new Date(Date.now()).toString();
  console.log('pages...');
  let contentId = Number(request.params.contentId);
  let photoId = Number(request.params.imageId);
  console.log(`${contentId} ${photoId}`);
  image.getImageData(photoId)
  .then(data => {
    console.log('sending file ...');
    response.contentType('image/png');
    response.send(data);
  })
  .catch(e => response.status(404).send('No image were found.'));
}

function getLabel(request, response)  {
  let date = new Date(Date.now()).toString();
  console.log('pages...');
  let contentId = Number(request.params.contentId);
  let photoId = Number(request.params.imageId);
  let objectX = Number(request.params.objectX);
  let objectY = Number(request.params.objectY);
  console.log(`${contentId} ${photoId}`);
  label.getLabel(photoId, objectX, objectY)
  .then(x => {
    if(x.length > 0) {
      response.json({name: x[0].name, number: x[0].number});
    } else {
      response.status(404).send('No words were found.');
    }
  })
  .catch(e => {
    console.log(e);
    response.status(500).send('Server error.');
  });

}

module.exports = { getAllThemes, getLabel, getImageData, getImageIds, getLabels }
