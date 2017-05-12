/**
 * Created by yuhao on 4/29/17.
 */
var mongoose = require('mongoose');

var itemModel = mongoose.model('Item', new mongoose.Schema({
    user_id: String,
    name: String,
    description: String,
    price: Number,
    longitude: Number,
    latitude: Number,
    contact: String,
    picture: String
},
    {timestamps: true}
));

module.exports = itemModel;