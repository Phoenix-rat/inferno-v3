const mongoose = require('mongoose');
module.exports = mongoose.model('Gangs', new mongoose.Schema({
    _id: String, //isim
    discriminator: String,
    roleID: String,
    VchannelID: String,
    CchannelID: String,
    created: Date
}, { _id: false }));