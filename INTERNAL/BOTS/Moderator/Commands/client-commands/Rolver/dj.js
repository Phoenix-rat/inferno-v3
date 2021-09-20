const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
class Dj extends Command {
    constructor(client) {
        super(client, {
            name: "dj",
            description: "Kişiye DJ rolü verir",
            usage: "dj @Fero/ID",
            examples: ["dj @Fero/ID"],
            category: "Rolver",
            aliases: [],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-ability"],
            cooldown: 1000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (mentioned.roles.cache.has(roles.get("role_dj").value())) {
            await mentioned.roles.remove(roles.get("role_dj").value());
            await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        } else {
            await mentioned.roles.add(roles.get("role_dj").value());
            await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        }
    }
}
module.exports = Dj;