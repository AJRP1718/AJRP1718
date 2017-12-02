var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var path = require('path');
var uis = require("./api/uis/uis.js");
var baseApiUrl = "/api/v1/uis";

module.exports = router;

app.use(bodyParser.json());

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

router.get(baseApiUrl,uis.get);
router.get(baseApiUrl+"/:uid",uis.getUid);
router.get(baseApiUrl+"/:uid/:view/:ctrl", uis.getMVC);
router.post("/uploadFiles",uis.postFiles);
router.post(baseApiUrl, uis.post);
router.post(baseApiUrl+"/:uid",uis.postModel)
router.post(baseApiUrl+"/:uid/:view",uis.postMV);
router.post(baseApiUrl+"/:uid/:view/:ctrl",uis.postMVC);
router.delete(baseApiUrl+"/:uid/:view/:ctrl",uis.deleteMVC);