const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
    name: String,
    continent: String,
    capital: String,
    population: String,
    territory: String,
    tag: String,
})

tagSchema.methods.setTag = function setTag () {

}

const User = mongoose.model('tag', tagSchema)

module.exports = User