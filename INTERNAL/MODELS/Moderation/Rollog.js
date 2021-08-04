const mongoose = require('mongoose');
module.exports = mongoose.model('Rollogs', new mongoose.Schema({
    _id: String,
    rolveridb: { type: Array, default: [] }
}, { _id: false }));