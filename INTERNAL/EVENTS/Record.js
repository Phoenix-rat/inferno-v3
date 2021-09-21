const Punishments = require('../MODELS/StatUses/Punishments');
const gen = require('shortid');
class Record {
    constructor(client) {
        this.client = client;
    };

    async run(user, executor, reason, punish, type, duration) {
        function altilik(value) {
            let number = value.toString();
            while (number.length < 6) {
                number = "0" + number
            }
            return number;
        }
        const records = await Punishments.findOne({ _id: user });
        const peer = {
            id: `${altilik(records ? records.length : 0)}`,
            reason: reason,
            executor: executor,
            punish: punish,
            type: type || "temp",
            duration: duration || 0,
            created: new Date()
        };
        if (!records) {
            const record = new Punishments({ _id: user, records: [] });
            await record.save();
        }
        await Punishments.updateOne({ _id: user }, { $push: { records: peer } });
    }
}

module.exports = Record;