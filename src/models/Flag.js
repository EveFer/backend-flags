const mongoose = require('mongoose')

const flagSchema = mongoose.Schema({
    name: String,
    continent: String,
    capital: String,
    population: String,
    territory: String,
    picture: String,
})

const Flag = mongoose.model('flag', flagSchema)

module.exports = Flag