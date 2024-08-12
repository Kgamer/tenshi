const mongoose = require('mongoose')
const { Schema } = mongoose

const reqString = {
    type: String,
    required: true
}

const schema = new Schema({
    memberId: reqString,
    date: reqString
})

module.exports = mongoose.model['premium'] || mongoose.model('premium', schema)