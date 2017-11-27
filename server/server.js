var path = require('path');
var express = require('express');
var bodyParser = require("body-parser");
var helmet = require("helmet");
var app = express();
var cors = require("cors");
var port = (process.env.PORT || 8080);
var routes = require("./routes.js");

app.use(cors()); // allow Cross-Origin Resource Sharing 
app.use(bodyParser.json()); //use default json enconding/decoding
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet()); //improve security

// For all GET requests, send back index.html
app.use("/",routes);

// Start the app by listening on the default
// Heroku port
app.listen(port, () => {
    console.log("Magic happens on port: " + port);
  });
  