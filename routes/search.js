var express = require('express');
var router = express.Router();
var elastic = require('../services/es');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();

router.get('/create_index', function(req, res, next) {
    elastic.indexExists().then(function(exist) {
        //console.log("index exist or not");
        if (exist) {
            //console.log("create index");
            return elastic.deleteIndex();
        }
    }).then(elastic.initIndex).then(
        function(data){
            res.json(elastic.initMapping());
        }
    );
});

router.get('/delete_index', function(req, res, next) {
    elastic.indexExists().then(function(exist) {
        if (exist) {
            res.json(elastic.deleteIndex());
        }
        res.json(null);
    });
});

// Post document to be indexed
// Example data format
// {
//     "username": "Tianci",
//     "title": "Testing",
//     "geo": [41.12, -71.34],
//     "tag": "people",
//     "created": 1420070400000,
//     "price": 12.00
//     "description": "teeeeeeeesting"
//     "contact": "what ever"
// }
router.post('/', function(req, res, next) {
    elastic.addDocument(req.body).then(function(result) {
        res.json(result);
    });
});

// Get all goodies
router.get('/all', function(req, res, next) {
    elastic.getAllContent(function(result) {
        res.json({'count': result.length, 'itemStack': result} );
    });
});

// Get to search goodies by title
router.get('/title/:input', function(req, res, next) {
    elastic.searchTitle(req.params.input, function(result) {
        res.json({'count': result.length, 'itemStack': result} );
    });
});

// Get to search goodies by description
router.get('/description/:input', function(req, res, next) {
    elastic.searchDescription(req.params.input, function(result) {
        res.json({'count': result.length, 'itemStack': result} );
    });
});

// Get to search goodies by title and description
router.post('/title/description/:input', multipartMiddleware, function(req, res, next) {
    console.log(req.body);
    var posterBody = req.body;
    // console.log(posterBody.data_length);
    var item_length = parseInt(posterBody.data_length, 10);
    elastic.searchTitleDescription(req.params.input, function(result) {
        console.log(result);
        part = [];
        if (item_length < result.length) {
            for (i = item_length; i < item_length + 2 && i < result.length; i++) {
                    part.push(result[i]);
            }
        }
        console.log(part);
        res.json({'count': result.length, 'itemStack': part});
    });
});

// Get to search goodies by geo //[33.57967856, 130.254707]
router.get('/geo/:distance/:lat/:lon', function(req, res, next) {
    elastic.searchGeo(req.params.distance, req.params.lat, req.params.lon, function (result) {
        res.json({'count': result.length, 'itemStack': result} );
    });
});

// Get to search goodies by created time
router.get('/created/:period', function(req, res, next) {
    elastic.searchCreated(req.params.period, function (result) {
        res.json({'count': result.length, 'itemStack': result });
    });
});

// Count number of goodies
router.get('/count', function(req, res, next) {
    elastic.count().then(function(result) {
        res.json(result);
    });
});

module.exports = router;
