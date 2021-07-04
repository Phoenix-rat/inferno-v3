const Mongoose = require("mongoose");
const queue = new Mongoose.Schema({
    _id: String,
    textChannel: Object,
    channel: Object,
    connection: Map,
    list: Array,
    loop: Boolean,
    volume: Number,
    playing: Boolean,
    playingMessage: String,
    no: Number
}, { _id: false });
module.exports = Mongoose.model('Queue', queue);