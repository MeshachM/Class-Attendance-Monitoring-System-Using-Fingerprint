/* eslint-disable indent */
import mongoose from 'mongoose'
var Schema = mongoose.Schema

var controls = new Schema({
    _id: String,
    alarm: {
        type: Number,
        default: 0,
    },
})

mongoose.models = {}

var Controls = mongoose.model('Controls', controls)

export default Controls
