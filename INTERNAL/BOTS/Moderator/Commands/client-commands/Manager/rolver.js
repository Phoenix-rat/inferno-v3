const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Perm extends Command {
    constructor(client) {
        super(client, {
            name: "yetenek",
            description: "Sunucuda bulunan üyelere perm vermek için kullanılır",
            usage: "yetenek @Kahve/ID vip",
            examples: ["rolver @Kahve/ID -ability"],
            cooldown: 3600000,
            category: "Perm",
            aliases: ["rolver","yetenekver"],
            accaptedPerms: ["cmd-ceo"],
            enabled: false
        });
    }
    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

    }
}

module.exports = Perm;