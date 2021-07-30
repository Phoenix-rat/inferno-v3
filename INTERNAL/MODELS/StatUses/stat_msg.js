const mongoose = require('mongoose');
module.exports = mongoose.model('stat_msg', new mongoose.Schema({
    _id: String,
    channel: Array,
    messagenumber: Number


}, { _id: false }));