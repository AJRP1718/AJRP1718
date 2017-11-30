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
    //POST a single resource
    post: function (request, response, next) {
        var newData = request.body;
        if (!newData) {
            console.log("WARNING: New POST request to /spain-births/ without birth, sending 400...");
            response.sendStatus(400); // bad request  
        } else {
            console.log(newData.options);
            console.log("INFO: New POST request to /uis/ with body: " + JSON.stringify(newData, 2, null));
            if (newData.uid && newData.options &&
                newData.uid != undefined && newData.options != undefined &&
                isNaN(newData.uid) && isNaN(newData.options) &&
                Object.keys(newData).length == 2) {
                if (newData.options[0].view && newData.options[0].ctrl &&
                    newData.options[0].view != undefined && newData.options[0].ctrl != undefined &&
                    isNaN(newData.options[0].view) && isNaN(newData.options[0].ctrl) &&
                    Object.keys(newData.options[0]).length == 2) {
                    Uis.find({
                        "uid": newData.uid
                    }, function (err, data) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        } else {
                            var dataBeforeInsertion = data.filter((result) => {
                                return (result.uid.localeCompare(newData.uid, "en", {
                                    'sensitivity': 'base'
                                }) === 0);
                            });
                            if (dataBeforeInsertion.length > 0) {
                                console.log("WARNING: The data " + JSON.stringify(newData, 2, null) + " already exist, sending 409...");
                                response.sendStatus(409); // conflict
                            } else {
                                const dirPath = './client/app/uis/' + newData.uid;
                                if (fs.existsSync(dirPath)) {
                                    console.log("WARNING: The folder " + newData.uid + " already exists");
                                    response.sendStatus(409); // conflict
                                } else {
                                    fs.mkdirSync(dirPath);
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
                                }
                            }
                        }
                    })
                } else {
                    console.log("WARNING: The data " + JSON.stringify(newData, 2, null) + " is not well-formed, sending 422...");
                    response.sendStatus(422); // unprocessable entity                    
                }
            } else {
                console.log("WARNING: The data " + JSON.stringify(newData, 2, null) + " is not well-formed, sending 422...");
                response.sendStatus(422); // unprocessable entity
            }
        }
    },
    //POST Model
    postModel: function (request, response, next) {
        var uid = request.params.model;
        console.log("WARNING: New POST request to /uis/" + uid + ", sending 405...");
        response.sendStatus(405); // method not allowed
    },
    //POST Model and View
    postMV: function (request, response, next) {
        var uid = request.params.uid;
        var view = request.params.view;
        console.log("WARNING: New POST request to /uis/" + uid + "/" + view + ", sending 405...");
        response.sendStatus(405); // method not allowed
    },
    //POST Model, View and Ctrl
    postMVC: function (request, response, next) {
        var uid = request.params.uid;
        var view = request.params.view;
        var ctrl = request.params.ctrl;
        console.log("WARNING: New POST request to /uis/" + uid + "/" + view + "/" + ctrl + ", sending 405...");
        response.sendStatus(405); // method not allowed
    },
    //DELETE over a single resource
    deleteMVC: function (request, response, next) {
        var uid = request.params.uid;
        var view = request.params.view;
        var ctrl = request.params.ctrl;
        if (!uid && !view && !ctrl) {
            console.log("WARNING: New DELETE request to /uis/" + uid + "/" + view + "/" + ctrl + " without params, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New DELETE request to /uis/" + uid + "/" + view + "/" + ctrl);
            const dirPath = './client/app/uis/' + uid;
            Uis.find({
                "uid": uid,
                "options.view": view,
                "options.ctrl": ctrl
            }, function (err) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                    request.end();
                }
            }).remove(function (err) {
                if (err) {
                    console.log("WARNING: There are no data to delete");
                    response.sendStatus(404); // not found
                    response.end(err);
                } else {
                    fs.rmdirSync(dirPath);
                    console.log("INFO: Data removed: " + uid + " " + view + " " + ctrl);
                    console.log("INFO: The data with model: " + uid + ", view: " + view + ", ctrl: " + ctrl + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                    response.end();
                }
            });
        }
    }


}