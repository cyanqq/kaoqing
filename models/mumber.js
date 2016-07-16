var mongoose = require('mongoose')
var MumberSchema = require('../schemas/mumber.js')
var Mumber = mongoose.model('Mumber', MumberSchema)

module.exports = Mumber