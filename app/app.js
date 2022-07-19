const express = require('express');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const app = express();

//init database
require('./db/mongoose');

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../views'));

// set layout
app.use(ejsLayouts);
app.set('layout', 'layouts/main.ejs');

//public folder
app.use(express.static('public'));

//body parser  //application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//middleware
app.use('/', require('./middleware/view-variables'));

//mount routes
app.use(require('./routes/web'));



module.exports = app;