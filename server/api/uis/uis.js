var dataTestModel = require("../../model/uis");
require('mongoose').model('uis');
var mongoose = require('mongoose');
var Uis = mongoose.model('uis');
var path = require('path');
var fs = require("fs");
module.exports = {
    // GET a collection
    get: function (request, response, next) {
        Uis.find({}, function (err, data) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Sending data: " + JSON.stringify(data, 2, null));
                response.send(data);
            }
        });
    },
    //GET multiple resource (?)
    getUid: function (request, response, next) {
        var uid = request.params.uid;
        if (!uid) {
            console.log("WARNING: New GET request to /uis/" + uid + " without uid, sending 400...");
            response.sendStatus(400); // bad request           
        }
        Uis.find({
            "uid": uid
        }, function (err, data) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error                
            } else {
                if (data.length > 0) {
                    console.log("INFO: Sending contact: " + JSON.stringify(data, 2, null));
                    response.send(data);
                } else {
                    console.log("WARNING: There are not any data with that params");
                    response.sendStatus(404); // not found
                }
            }
        })
    },
    //GET a single resource
    getMVC: function (request, response, next) {
        var uid = request.params.uid;
        var view = request.params.view;
        var ctrl = request.params.ctrl;
        if (!uid && !view && !ctrl) {
            console.log("WARNING: New GET request to /uis/" + uid + "/" + view + "/" + ctrl + " without params, sending 400...");
            response.sendStatus(400); // bad request            
        } else {
            console.log("INFO: New GET request to /uis/" + uid + "/" + view + "/" + ctrl);
            Uis.find({
                "uid": uid,
                "options.view": view,
                "options.ctrl": ctrl
            }, function (err, data) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    if (data.length > 0) {
                        console.log("INFO: Sending contact: " + JSON.stringify(data, 2, null));
                        response.send(data);
                    } else {
                        console.log("WARNING: There are not any data with that params");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    },
    //POST over a collection
    post: function (request, response, next) {
        var newData = request.body;
        Uis.collection.insert(newData, {
            ordered: true
        }, function (err) {
            if (err) {
                response.status(504); //gateway timeout
                response.end(err);
            } else {
                console.log("INFO: Adding data " + JSON.stringify(newData, 2, null));
                response.sendStatus(201); // created
                response.end();
            }
        });
    },

}