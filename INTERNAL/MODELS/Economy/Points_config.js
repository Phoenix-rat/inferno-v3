const mongoose = require('mongoose');
module.exports = mongoose.model('Points_config', new mongoose.Schema({
    _id: String,
    requiredPoint: Number,
    expiringHours: Number,
    registry: Number,
    invite: Number,
    tagged: Number,
    authorized: Number,
    message: Number,
    voicePublic: Number,
    voiceOther: Number,
    bonus: Number,
    charge: Number
}, { _id: false }));