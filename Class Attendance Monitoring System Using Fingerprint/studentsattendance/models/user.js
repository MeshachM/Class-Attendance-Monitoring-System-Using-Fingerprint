var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    _id: String,
    name: {
        type: String,
        default: 'Name',
    },
    type: {
        type: String,
        default: 'student',
        enum: ['student', 'lecture']
    },
    lecture: {
        ref: 'User',
        type: String,
        default: '1',
    },
    time: {
        type: Date,
        default: Date.now
    }
});

mongoose.models = {};

var User = mongoose.model('User', user);

module.exports = User;