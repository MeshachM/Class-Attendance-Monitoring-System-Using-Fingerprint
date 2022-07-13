var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lesson = new Schema({
    name: {
        type: String,
        default: 'Lesson',
    },
    lecture: {
        type: String,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        default: 'on',
    },
    time: {
        type: Date,
        default: Date.now
    }
});

mongoose.models = {};

var Lesson = mongoose.model('Lesson', lesson);

module.exports = Lesson;