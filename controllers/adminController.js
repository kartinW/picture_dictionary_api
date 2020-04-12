'use strict';


const theme = require('../models/theme.js');
const label = require('../models/label.js');
const image = require('../models/image.js');

function saveTheme(request, response) {
  let date = new Date(Date.now()).toString();
  console.log(date + " - new theme - " + request.body.theme);
  theme.saveTheme(request.body.theme)
    .then(id => response.status(200).json(id))
    .catch(e => response.status(500).send('The theme could not be added.'));

}

function saveImageData (request, response) {
  console.log(`/image/${ request.params.contentId} received.`);

  let imageFile = request.files.image;

  image.saveImageMetaData(request.params.contentId)
  .then(image => {
    return image.saveImageData(image.id, imageFile)
                            .then(() => image);

  })
  .then(image => {
    console.log(`The iamge ${image.id} saved to the database.`);
    return response.json(image.id);
  })
  .catch(e => {
    console.log('The image could not be saved.');
    console.log(e);
    response.status(500).send('The image could not be saved.');
  });
}

function updateImageData(request, response) {
  console.log(`/image/${ request.params.imageId} received to be updated.`);

  let imageFile = request.files.image;
  let imageId = request.params.imageId

  image.saveImageData(imageId, imageFile)
  .then(x => {
    console.log(`The image ${imageId} updated.`);
    return response.status(200).json({message:'The image updated.'});
  })
  .catch(e => {
    console.log(e);
    response.status(500).send('The image could not be updated.');
  });
}

function saveLabel(request, response) {
  let date = new Date(Date.now()).toString();
  console.log(date + " - new word - " + request.body.name
                                      + "-" + request.body.x
                                      + "-" + request.body.y
                                      + "-" + request.body.number
                                      + "-" + request.body.imageId);
  label.saveLabel(request.body.name,
               request.body.x,
               request.body.y,
               request.body.number,
               request.body.imageId)
    .then(id => response.status(200).json(id))
    .catch(e => {
      console.log(e);
      response.status(500).send('The label could not be added.');
    });
}

function updateLabel (request, response) {
  let date = new Date(Date.now()).toString();
  console.log(date + " - new word - " + request.body.name
                                      + "-" + request.body.id
                                      );
  label.updateLabel(request.body.name,
               request.body.id)
    .then(id => response.status(200).json(id))
    .catch(e => {
      console.log(e);
      response.status(500).send('The label could not be updated.');
    });
}

module.exports = { saveTheme, saveImageData, updateImageData, saveLabel, updateLabel }
