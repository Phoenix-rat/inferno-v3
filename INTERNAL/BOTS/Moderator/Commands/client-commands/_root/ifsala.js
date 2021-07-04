const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "ifsala",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["orospuevladıfloodcu"],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const yy = Object.keys(client.cmdCoodown).reverse()[Number(args[0]) || 0];
        await message.channel.send(`${message.guild.members.cache.get(yy)}`)

    }

}

module.exports = Kur;