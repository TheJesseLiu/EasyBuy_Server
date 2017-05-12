var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var authService = require('../services/authService');
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var jsonParser = bodyParser.json();

router.post('/login', multipartMiddleware, function(req, res) {
    authService.login(req.body.email, req.body.password, function(json) {
        if (json.status !== 200) {
            res.status(json.status).send({status:"404", message:"Incorrect email or password"});
        } else {
            res.send({status:"200", message:"success"});
        }
    });
});

router.post('/register', multipartMiddleware, function(req, res) {
    console.log("register");
    bodyPoster = req.body;
    console.log(bodyPoster.fullname);
    authService.reg(bodyPoster.email, bodyPoster.password, req.body.fullname,
        function(json) {
            console.log(json);
            if (json.status === 409) {
                res.status(409).send({status:"409", message:"Email existed"});
            } else {
                res.send({status:"200", message:"yayaya"});
            }
        });
});

router.post('/getName', multipartMiddleware, function(req, res) {
    console.log("getName");
    bodyPoster = req.body;
    console.log(bodyPoster.email);
    var promise = authService.getName(bodyPoster.email);
    promise.then(function(doc){
        res.setHeader('Content-Type', 'application/json');
        console.log("fullname here"+doc[0].fullname);
        var json = {fullname: doc[0].fullname}
        res.send(json);
    });

});

module.exports = router;