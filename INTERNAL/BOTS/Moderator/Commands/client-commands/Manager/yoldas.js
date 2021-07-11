const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Avatar extends Command {

    constructor(client) {
        super(client, {
            name: "yoldas",
            description: "Bahsi geçen kişiye yoldaş rolünü verir.",
            usage: "yoldaş @etiket/id",
            examples: ["yoldaş 674565119161794560"],
            category: "Düzen",
            aliases: ["yoldaş"],
            accaptedPerms: ["cmd-ability", "cmd-all"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        await mentioned.roles.add(roles.get("yoldas").value());
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));


    }
}

module.exports = Avatar;