/**
 * Created by yuhao on 4/29/17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.write("Hello world!");
    res.end();
});
module.exports = router;