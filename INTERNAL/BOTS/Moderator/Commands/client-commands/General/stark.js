const Command = require("../../../Base/Command");
const stat_msg = require('../../../../../MODELS/StatUses/stat_msg');
class stark extends Command {

    constructor(client) {
        super(client, {
            name: "stark",
            description: "sunucunun tagını gönderir",
            usage: "stark",
            examples: ["stark"],
            cooldown: 1000,
        });
    }

    async run(client, message, args) {
        const messageXp = await stat_msg.findOne({ _id: message.author.id });

        if(messageXp) {
            console.log(messageXp)
        }
        else { 
            message.reply("veri yok")
        }

    }
}

module.exports = stark;