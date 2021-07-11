const mongoose = require('mongoose');
module.exports = mongoose.model('tagged', new mongoose.Schema({
    _id: String,
    executor: String,
    target: String,
    channelID: String,
    created: Date
}, { _id: false }));