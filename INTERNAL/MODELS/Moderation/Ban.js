const mongoose = require('mongoose');
module.exports = mongoose.model('Ban', new mongoose.Schema({
    _id: String,
    userTag: String,
    executor: String,
    reason: String,
    created: Date
}, { _id: false }));