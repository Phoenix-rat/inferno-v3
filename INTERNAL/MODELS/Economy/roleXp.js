const mongoose = require('mongoose');
module.exports = mongoose.model('xp_award', new mongoose.Schema({
    _id: String,
    requiredXp: Number,
    salary: Number
}, { _id: false }));