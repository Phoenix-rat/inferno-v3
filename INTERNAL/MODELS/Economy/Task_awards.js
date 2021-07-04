const mongoose = require('mongoose');
module.exports = mongoose.model('task_awards', new mongoose.Schema({
    _id: String,
    point: Number,
    salary: Number
}, { _id: false }));