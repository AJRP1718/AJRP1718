var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var path = require('path');

module.exports = router;

app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});