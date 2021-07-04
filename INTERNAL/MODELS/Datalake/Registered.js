const mongoose = require('mongoose');
module.exports = mongoose.model('registries', new mongoose.Schema({
    _id: String,
    executor: String,
    created: Date,
    name: String,
    age: Number,
    sex: String
}, { _id: false }));