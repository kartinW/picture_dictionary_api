// dependencies
const express = require('express');
var bodyParser = require('body-parser')
const url = require('url');
const fileUpload = require('express-fileupload');
var cors = require('cors');
const db = require('./db.js');

//create the server
const app = express();
const port = 4002;

// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());
app.use(cors());




app.post('/theme', (request, response) => {
  let date = new Date(Date.now()).toString();
  console.log(date + " - new theme - " + request.body.theme);
  db.saveTheme(request.body.theme)
    .then(id => response.status(200).json(id))
    .catch(e => response.status(500).send('The theme could not be added.'));

});

app.post('/image/:contentId', (request, response) => {
  console.log(`/image/${ request.params.contentId} received.`);

  let imageFile = request.files.image;

  db.saveImage(request.params.contentId)
  .then(image => {imageFile.mv('./data/' + image.name);return image;})
  .then(image => response.json(image.id))
  .catch(e => {
    console.log(e);
    response.status(500).send('The image could not be saved.');
  });
});

app.put('/image/:imageId', (request, response) => {
  console.log(`/image/${ request.params.imageId} received.`);

  let imageFile = request.files.image;

  db.getImageName(request.params.imageId)
  .then(name => {imageFile.mv('./data/' + name);})
  .then(() => response.status(200).json({message:'The image updated.'}))
  .catch(e => {
    console.log(e);
    response.status(500).send('The image could not be saved.');
  });
});

app.post('/label', (request, response) => {
  let date = new Date(Date.now()).toString();
  console.log(date + " - new word - " + request.body.name
                                      + "-" + request.body.x
                                      + "-" + request.body.y
                                      + "-" + request.body.number
                                      + "-" + request.body.imageId);
  db.saveLabel(request.body.name,
               request.body.x,
               request.body.y,
               request.body.number,
               request.body.imageId)
    .then(id => response.status(200).json(id))
    .catch(e => {
      console.log(e);
      response.status(500).send('The label could not be added.');
    });
});

app.put('/label', (request, response) => {
  let date = new Date(Date.now()).toString();
  console.log(date + " - new word - " + request.body.name
                                      + "-" + request.body.id
                                      );
  db.updateLabel(request.body.name,
               request.body.id)
    .then(id => response.status(200).json(id))
    .catch(e => {
      console.log(e);
      response.status(500).send('The label could not be updated.');
    });
});

app.get('/contents', (request, response) => {
  let date = new Date(Date.now()).toString();
  console.log('/contents');
  db.getAllThemes()
  .then(x => response.json(x))
  .catch(e => response.status(500).send('The themes could not be retrieved.'));
});

app.get('/labels/:imageId', (request, response) => {
  let date = new Date(Date.now()).toString();
  let imageId = request.params.imageId;
  console.log('/labels/' + imageId);
  db.getLabels(imageId)
  .then(x => response.json(x))
  .catch(e => response.status(500).send('The labels could not be retrieved.'));
});

app.get('/pages/:contentId', (request, response) => {
  let contentId = Number(request.params.contentId);
  db.getImageIds(contentId)
  .then(x => response.json(x.map(y => y.id)))
  .catch(e => response.status(404).send('No images were found for the content.'));
});


app.get('/pages/:contentId/image/:imageId', (request, response) => {
  let date = new Date(Date.now()).toString();
  console.log('pages...');
  let contentId = Number(request.params.contentId);
  let photoId = Number(request.params.imageId);
  console.log(`${contentId} ${photoId}`);
  db.getImageName(photoId)
  .then(x => {
    console.log('sending file ...');
    response.sendFile(__dirname + '/data/' + x);
  })
  .catch(e => response.status(404).send('No image were found.'));


});

app.get('/words/:contentId/:imageId/:objectX/:objectY', (request, response) => {
  let date = new Date(Date.now()).toString();
  console.log('pages...');
  let contentId = Number(request.params.contentId);
  let photoId = Number(request.params.imageId);
  let objectX = Number(request.params.objectX);
  let objectY = Number(request.params.objectY);
  console.log(`${contentId} ${photoId}`);
  db.getLabel(photoId, objectX, objectY)
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

});

// start the server
app.listen(port, () => console.log('Listening on port ' + port));
