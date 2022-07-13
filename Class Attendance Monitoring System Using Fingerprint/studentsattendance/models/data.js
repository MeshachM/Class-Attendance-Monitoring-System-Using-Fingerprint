/* eslint-disable indent */
import mongoose from 'mongoose'
var Schema = mongoose.Schema

var data = new Schema({
  action: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
})

mongoose.models = {}

var Data = mongoose.model('Data', data)

export default Data
