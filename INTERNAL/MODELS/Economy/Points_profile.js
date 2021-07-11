const mongoose = require('mongoose');
module.exports = mongoose.model('Points_profile', new mongoose.Schema({
    _id: String,
    role: String,
    points: Array,
    msgPoints: Number,
    excused: Boolean,
    created: Date
}, { _id: false }));