'use strict';

require('dotenv').config();
const { Pool } = require('pg');

// check whether this api is runing on production server or not
const isProduction = process.env.IS_PRODUCTION !== 'false';
//onsole.log(process.env.IS_PRODUCTION);
console.log(`Is this the production environment? ${isProduction ? 'yes' : 'no'}`);


//postgresql://USER:PASSWORD@HOST:PORT/DATABASE

const postgreConnectionString =
 `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

console.log(postgreConnectionString);

const postgrePool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : postgreConnectionString,
  ssl: isProduction,
});

function saveTheme(name) {
   return postgrePool.query('insert into theme(name) values($1) returning id', [name])
   .then(result => result.rows[0].id);
}

function saveImage(themeId) {
  let maxId = (new Date()).getTime().toString(36);
  getLastImageId(themeId).then(x => {if(x[0].maxId) maxId += x[0].maxId;});
  let imageName = maxId + "-" + themeId + ".png";
   return postgrePool.query('insert into image(name, themeid) values($1, $2) returning *', [imageName, themeId])
   .then(result => result.rows[0]);
}

function getLastImageId(themeId) {
  return postgrePool.query('select max(id) as maxId from image where themeid = $1', [themeId])
  .then(result => {console.log(result.rows[0]); return result.rows});
}

function saveLabel(name, x, y, number, imageId) {
   return postgrePool.query(`insert into word(name,x,y,number,imageid)
                 values($1, $2, $3, $4, $5) returning id`, [name, x, y, number, imageId])
   .then(result => result.rows[0].id);
}

function updateLabel(name, id) {
   return postgrePool.query(`update word set name = $1 where id = $2 returning *`, [name, id])
   .then(result => result.rows[0].id);
}

function getLabel(imageId, x, y) {
  return postgrePool.query('select  * from word where imageid = $1 and abs(x - $2) < 7 and abs(y - $3) < 7', [imageId, x, y])
  .then(result => {console.log(result.rows); return result.rows});
}

function getAllThemes() {
  return postgrePool.query('select * from theme')
  .then(result => result.rows);
}

function getLabels(imageId) {
  return postgrePool.query('select * from word where imageid = $1', [imageId])
  .then(result => result.rows);
}

function getImageIds(themeId) {
  return postgrePool.query('select * from image where themeid = $1', [themeId])
  .then(result => result.rows);
}

function getImageName(imageId) {
  return postgrePool.query('select name from image where id = $1', [imageId])
  .then(result => result.rows[0].name);
}

function saveImageToDB(imageId, image) {
  //console.log(image);
  return postgrePool.query('update image set data =  $1 where id = $2', [image.data, imageId])
  .then(result => result.rows);
}

function getImageData(imageId) {
  return postgrePool.query('select data from image where id = $1', [imageId])
  .then(result => {
    if (result.rows[0]) {
      return result.rows[0].data;
    } else {
      throw Error('The imgae data could not be found in the database.');
    }
  });
}

module.exports = { saveTheme, getAllThemes, getImageIds, getImageName, saveImage, saveLabel, getLabel, getLabels , updateLabel, saveImageToDB, getImageData}
