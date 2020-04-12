'use strict';

const db = require('./db.js');


function getAllThemes() {
  return db.getAllThemes();
}
function saveTheme(themeName) {
  return db.saveTheme(themeName);
}


module.exports = { getAllThemes, saveTheme }
