var dataTestModel = require("../../model/uis");
require('mongoose').model('uis');
var mongoose = require('mongoose');
var Uis = mongoose.model('uis');
var path = require('path');
var fs = require('fs');
var fsextra = require('fs-extra');
var shell = require('shelljs');
const fileUpload = require('express-fileupload');
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
    postFiles: function (request, response, next) {
        var view = request.files.view;
        if (!view) {
            console.log("WARNING: No view html uploaded")
            return response.status(400);
        }
        var ctrl = request.files.ctrl;
        if (!ctrl) {
            console.log("WARNING: No controller uploaded");
            return response.status(400);
        }

        if (view.name.split('.')[0] != ctrl.name.split('.')[0]) {
            console.log("WARNING: It must be " + view.name.split('.')[0] + ".controller.js");
            return response.status(400);
        }
        if (view.name.split('.')[1] + "." + view.name.split('.')[2] != "template.html") {
            console.log("WARNING: It must be " + view.name.split('.')[0] + ".template.html");
            return response.status(400);
        }
        if (ctrl.name.split('.')[1] + "." + ctrl.name.split('.')[2] != "controller.js") {
            console.log("WARNING: It must be " + ctrl.name.split('.')[0] + ".controller.js");
            return response.status(400);
        }
        var model = view.name.split('.')[0];
        console.log("Uploading " + model + '/' + view.name + '/' + ctrl.name);
        var dirPath = './client/app/uis/' + model;
        var templatePath = './client/app/uis/' + model + '/' + view.name;
        var controllerPath = './client/app/uis/' + model + '/' + ctrl.name;
        var indexPath = './client/index.html';
        var lines=ctrl.data.toString();
        if(fs.existsSync(dirPath)){
            console.log("WARNING: "+dirPath+" already exists, sending 409...");
            return response.sendStatus(409);
        }
        if(!lines.includes(".module('renderApp')")){
            console.log("WARNING: It must be .module('renderApp')");
            return response.status(400);
        }
        if(!lines.includes(".controller('"+model+"',")){
            console.log("WARNING: It must be .controller('"+model+"', function ...");
            return response.status(400);
        }
        fsextra.ensureDir(dirPath)
            .catch(err => {
                console.error(err)
            })
        view.mv(templatePath, function (err) {
            if (err)
                return response.status(500).send(err);
        });

        ctrl.mv(controllerPath, function (err) {
            if (err)
                return response.status(500).send(err);
        });
        
        shell.sed('-i', '</html>', '<script type="text/javascript" src="app/uis/' + model + '/' + ctrl.name + '"></script>\n</html>', indexPath);    
        
        response.sendStatus(201);
        response.end();
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
    putFiles: function(request, response, next){
        var view = request.files.view;
        if (!view) {
            console.log("WARNING: No view html uploaded")
            return response.status(400);
        }
        var ctrl = request.files.ctrl;
        if (!ctrl) {
            console.log("WARNING: No controller uploaded");
            return response.status(400);
        }

        if (view.name.split('.')[0] != ctrl.name.split('.')[0]) {
            console.log("WARNING: It must be " + view.name.split('.')[0] + ".controller.js");
            return response.status(400);
        }
        if (view.name.split('.')[1] + "." + view.name.split('.')[2] != "template.html") {
            console.log("WARNING: It must be " + view.name.split('.')[0] + ".template.html");
            return response.status(400);
        }
        if (ctrl.name.split('.')[1] + "." + ctrl.name.split('.')[2] != "controller.js") {
            console.log("WARNING: It must be " + ctrl.name.split('.')[0] + ".controller.js");
            return response.status(400);
        }
        var model = view.name.split('.')[0];
        console.log("Uploading " + model + '/' + view.name + '/' + ctrl.name);
        var dirPath = './client/app/uis/' + model;
        var templatePath = './client/app/uis/' + model + '/' + view.name;
        var controllerPath = './client/app/uis/' + model + '/' + ctrl.name;
        var lines=ctrl.data.toString();
        if(!lines.includes(".module('renderApp')")){
            console.log("WARNING: It must be .module('renderApp')");
            return response.status(400);
        }
        if(!lines.includes(".controller('"+model+"',")){
            console.log("WARNING: It must be .controller('"+model+"', function ...");
            return response.status(400);
        }        
        view.mv(templatePath, function (err) {
            if (err)
                return response.status(500).send(err);
        });

        ctrl.mv(controllerPath, function (err) {
            if (err)
                return response.status(500).send(err);
        });
        response.sendStatus(201);
        response.end();
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
                    fsextra.remove(dirPath);
                    var indexPath = './client/index.html';
                    shell.sed('-i', '<script type="text/javascript" src="app/uis/' + uid + '/' + ctrl + '"></script>', '', indexPath);                    
                    console.log("INFO: Data removed: " + uid + " " + view + " " + ctrl);
                    console.log("INFO: The data with model: " + uid + ", view: " + view + ", ctrl: " + ctrl + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                    response.end();
                }
            });
        }
    }


}