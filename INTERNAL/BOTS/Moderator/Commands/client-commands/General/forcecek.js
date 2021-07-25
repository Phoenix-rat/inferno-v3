const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Gel extends Command {

    constructor(client) {
        super(client, {
            name: "forcecek",
            description: "İstediğiniz kişinin odasına gidin",
            usage: "forcecek etiket/id",
            examples: ["forcecek 674565119161794560"],
            accaptedPerms: ["cmd_dante"],
            aliases: ["fcek"],
            category: "Moderasyon",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        if (mentioned.user.id === message.member.user.id) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("pando1").value()} Kendi kendini etiketleme..`).setColor('#2f3136'));
        let kanal = message.member.voice.channel;
        if (!kanal) return message.react(emojis.get("komutret").value().split(':')[2].replace('>', ''));
        if (!mentioned.voice || !mentioned.voice.channel) return message.react(emojis.get("komutret").value().split(':')[2].replace('>', ''));
        if (kanal.id === mentioned.voice.channel.id) return message.react(emojis.get("komutret").value().split(':')[2].replace('>', ''));
        await mentioned.voice.setChannel(kanal.id);
        await message.react(emojis.get("komutonay").value().split(':')[2].replace('>', ''));
     
   
    }
}

module.exports = Gel;