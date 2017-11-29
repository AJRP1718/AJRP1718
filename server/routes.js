var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var path = require('path');
var uis = require("./api/uis/uis.js");
var baseApiUrl = "/uis";

module.exports = router;

app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

router.get(baseApiUrl,uis.get);
router.get(baseApiUrl+"/:uid",uis.getUid);
router.get(baseApiUrl+"/:uid/:view/:ctrl", uis.getMVC);
router.post(baseApiUrl, uis.post);