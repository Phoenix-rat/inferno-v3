const mongoose = require('mongoose');
module.exports = mongoose.model('guildSnipe', new mongoose.Schema({
    _id: String,
    author: String,
    content: String,
    date: Number,
    channel: String
}, { _id: false }));