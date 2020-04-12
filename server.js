// dependencies
const express = require('express');
var bodyParser = require('body-parser')
const url = require('url');
const fileUpload = require('express-fileupload');
var cors = require('cors');

const generalRouter = require('./routers/generalRouter.js');
const adminRouter = require('./routers/adminRouter.js');

//create the server
const app = express();
const port = process.env.PORT || 4002;

// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());
app.use(cors());
app.use('/home', generalRouter);
app.use('/admin', adminRouter);


app.get('/', (request, response) => {
  response.send('welcome to our picture dictionary service.')
});

// start the server
app.listen(port, () => console.log('Listening on port ' + port));
