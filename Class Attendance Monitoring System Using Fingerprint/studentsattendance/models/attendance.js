var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attendance = new Schema({
    name: {
        type: String,
        default: 'Attendance',
    },
    lesson: {
        ref: 'Lesson',
        required: true,
        type: Schema.Types.ObjectId,
    },
    student: {
        ref: 'User',
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now
    }
});

mongoose.models = {};

var Attendance = mongoose.model('Attendance', attendance);

module.exports = Attendance;