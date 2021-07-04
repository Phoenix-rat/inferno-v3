const mongoose = require('mongoose');
module.exports = mongoose.model('Duties', new mongoose.Schema({
    _id: String,
    records: Array
}, { _id: false }));