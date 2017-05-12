var config = require('./config/config.json');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
//var cors = require('cors');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var searchRouter = require("./routes/search");
var itemRouter = require("./routes/item");
// var dbRouter = require("./routes/db");

mongoose.Promise = global.Promise; // Ref: http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
mongoose.connect('mongodb://' + config.DB_USERNAME + ':' + config.DB_PASSWORD + ':spring2017@ds123381.mlab.com:23381/nearbyshopping');
console.log('Connected to Mongodb database ... ');

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/search', searchRouter);
app.use('/item',itemRouter);