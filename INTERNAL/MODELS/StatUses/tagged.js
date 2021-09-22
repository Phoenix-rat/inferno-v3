const mongoose = require('mongoose');
module.exports = mongoose.model('tagged', new mongoose.Schema({
    _id: String,
    verifier: String,
    executor: String,
    created: Date
}, { _id: false }));