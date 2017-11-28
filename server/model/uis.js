var mongoose = require('mongoose');
var Uis = new mongoose.Schema({
    uid: String,
    options: [{
        view: String,
        ctrl: String
    }]
});

mongoose.model('uis', Uis);



