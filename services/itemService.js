var itemModel = require('../models/itemModel');

/**
 * Created by yuhao on 4/30/17.
 */
/**
 * Created by yuhao on 4/30/17.
 */
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/S3_config.json');
var s3 = new AWS.S3();
var Uploader = require('s3-image-uploader');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var elastic = require('./es');

var download = function(){
    // console.log(itemlength);
    // var item = new itemModel({
    //     name: 'test item name',
    //     user_id:'test user id',
    //     price: 1111,
    //     contact: 'test contact',
    //     longitude: 122,
    //     latitude: 102,
    //     discription:"hard coded discription",
    //     picture: 'https://s3.amazonaws.com/androidfinalproject/Item_Image/0411172129.jpg'
    // });
    // item.save();
    var promise = itemModel.find({}).exec();
    return promise;
};
var useritem = function(user_id){
    // console.log(itemlength);
    // var item = new itemModel({
    //     name: 'test item name',
    //     user_id:'test user id',
    //     price: 1111,
    //     contact: 'test contact',
    //     longitude: 122,
    //     latitude: 102,
    //     discription:"hard coded discription",
    //     picture: 'https://s3.amazonaws.com/androidfinalproject/Item_Image/0411172129.jpg'
    // });
    // item.save();
    var promise = itemModel.find({user_id: user_id}).exec();
    return promise;
};

var upload = function (Item_name, Item_price, Contact_info, filename, long, lat, user_id) {
    // var doc = {
    //     username: user_id,
    //     title: Item_name,
    //     geo: [lat, long]
    //     ,
    //     description: "discription is null",
    //     url: 'https://s3.amazonaws.com/androidfinalproject/Item_Image/'+filename,
    //     price: Item_price,
    //     contact: Contact_info
    // };
    // elastic.addDocument(doc).then(function(result) {
    //     console.log("add documents to elastic search.");
    // });
    var item = new itemModel({
        name: Item_name,
        price: Item_price,
        contact: Contact_info,
        longitude: lat,
        latitude: long,
        user_id: user_id,
        discription:"hard coded discription",
        picture: 'https://s3.amazonaws.com/androidfinalproject/Item_Image/'+filename
    });
    console.log(item);
    item.save();
    console.log("upload to mongoDB");
};

module.exports = {
    download: download,
    upload: upload,
    useritem:useritem
};
    /*
    app.get('/download', function (req, res) {
    console.log('download');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
        {"itemStack":[
            {itemName: "itemname0",
                price: "0000",
                contact: "6666666",
                userName:"user0",
                link:"http://s3.amazonaws.com/androidfinalproject/Item_Image/mouse.png"},
            {itemName: "itemnam1",
                price: "1111",
                contact: "77777",
                userName:"user1",
                link:"https://s3.amazonaws.com/androidfinalproject/Item_Image/colicon21.png"}
        ]}
    ));
});

app.post('/upload', multipartMiddleware, function(req, res){
    console.log('POST /upload');
    var posterBody = req.body;
    var Item_name = posterBody.ItemName;
    var Item_price = posterBody.ItemPrice;
    var Contact_info = posterBody.ContactInfo;
    console.log(Item_name);
    console.log(Item_price);
    console.log(Contact_info);


    // for S3
    var posterData = req.files;
    filename = posterData.image.originalFilename;
    filePath = posterData.image.path;
    console.log(posterData);
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
        });

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("go fuck u");
    res.end();
});
*/