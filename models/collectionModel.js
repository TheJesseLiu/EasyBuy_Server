/**
 * Created by yuhao on 4/30/17.
 */
var mongoose = require('mongoose');

var collectionModel = mongoose.model('Collection', new mongoose.Schema({
        user_id: objectIds,
        item_id: objectIds
    }
));
module.exports = collectionModel;