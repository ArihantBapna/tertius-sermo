var mongoose = require('mongoose');
var userModel = mongoose.model('users',{
    _id: {type: String, required: true},
    id: {type: Number, required: false},
    username: {type: String, required: true},
    password: {type: String, required: true},
    sets: {type: String, required: false},
    email: {type: String, required: true},
    scores: {type: String, required: false}
});
module.exports = userModel;