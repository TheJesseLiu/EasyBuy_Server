/**
 * Created by yuhao on 4/30/17.
 */
var config2 = require('../config/S3_config.json');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var itemService = require('../services/itemService');
var jsonParser = bodyParser.json();
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var Uploader = require('s3-image-uploader');

router.post('/upload', multipartMiddleware, function(req, res) {
    console.log('post upload');
    // for S3
    var posterBody = req.body;
    console.log(posterBody);
    var Item_name = posterBody.ItemName;
    var Item_price = posterBody.ItemPrice;
    var Contact_info = posterBody.ContactInfo;
    var long = posterBody.longtitude;
    var lat = posterBody.latitude;
    var user_id = posterBody.user_id;
    var posterData = req.files;
    filename = posterData.image.originalFilename;
    filePath = posterData.image.path;
    console.log(Item_name);
    console.log(Item_price);
    console.log(Contact_info);
    console.log(posterData);

    itemService.upload(Item_name, Item_price, Contact_info, filename, long, lat, user_id);

    var uploader = new Uploader({
        aws : {
            key : config2.accessKeyId,
            secret : config2.secretAccessKey
        },
    });
    file = {
        fileId : 'someUniqueIdentifier',
        bucket : 'androidfinalproject',
        source : filePath,
        name : 'Item_Image/'+filename,
    }
    uploader.upload(file,
        function(data){ // success
            console.log('upload success:', data);
        },
        function(errMsg, errObject){ //error
            console.error('unable to upload: ' + errMsg + ':', errObject);
        }
    );
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("go fuck u");
    res.end();
});

router.post('/download', multipartMiddleware, function(req, res) {
    console.log('get download');
    var posterBody = req.body;
    console.log(posterBody.data_length);
    var item_length = parseInt(posterBody.data_length,10);
    var promise = itemService.download();
    items = []
    promise.then(function(doc){
        console.log(doc.length);
        var idx = doc.length-1- item_length;
        var cnt = 0
        for (var i = idx; i>=0&&cnt<4; i--){
            items.push({itemName: doc[i].name, price: doc[i].price, contact: doc[i].contact, link:doc[i].picture, userName: doc[i].user_id, geo: {lat:doc[i].latitude, lon: doc[i].longitude}});
            cnt++;
        }
        res.setHeader('Content-Type', 'application/json');
        var json = {itemStack:items}
        res.send(JSON.stringify(json));
    });
});

router.post('/useritem', multipartMiddleware, function(req, res) {
    console.log('get useritem');

    var posterBody = req.body;
    var item_length = parseInt(posterBody.data_length,10);
    var user_id = posterBody.email;
    console.log(user_id);
    var promise = itemService.useritem(user_id);
    // var promise = itemService.download();
    items = []
    promise.then(function(doc){
        console.log(doc.length);
        var idx = doc.length-1- item_length;
        var cnt = 0
        for (var i = idx; i>=0&&cnt<4; i--){
            items.push({itemName: doc[i].name, price: doc[i].price, contact: doc[i].contact, link:doc[i].picture, userName: doc[i].user_id, geo: {lat:doc[i].latitude, lon: doc[i].longitude}});
            cnt++;
        }
        res.setHeader('Content-Type', 'application/json');
        var json = {itemStack:items}
        res.send(JSON.stringify(json));
    });
});

module.exports = router;

