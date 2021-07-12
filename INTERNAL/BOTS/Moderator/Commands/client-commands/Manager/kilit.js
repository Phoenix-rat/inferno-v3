const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
class Move extends Command {

    constructor(client) {
        super(client, {
            name: "kanaltaşı",
            description: "kanalda bulunan kişileri toplu olarak bir kanala taşır",
            usage: "kanaltaşı kanalid/etiket/id",
            examples: ["kanaltaşı 718265023750996028"],
            cooldown: 3600000,
            category: "Düzen",
            accaptedPerms: ["cmd-single", "cmd-double", "cmd-ceo"]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        await message.channel.updateOverwrite(message.guild.roles.everyone.id, {
            SEND_MESSAGES: false
        });
        await message.channel.updateOverwrite(message.author.id, {
            SEND_MESSAGES: true
        });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));


    }

}

module.exports = Move;