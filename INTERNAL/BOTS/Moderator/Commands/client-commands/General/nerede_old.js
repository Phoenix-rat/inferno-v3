const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
class Where extends Command {

    constructor(client) {
        super(client, {
            name: "tnerede",
            description: "etiketlenen kişinin nerede olduğunu gösterir",
            usage: "tnerede id/etiket",
            examples: ["tnerede 674565119161794560"],
            aliases: ["tbul", "tn"],
            category: "Genel",
            cooldown: 300000,
            enabled: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.inlineReply(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));
        let desu = ``;
        let info = "";
        if (!mentioned.voice.channel) {
            desu = `Belirtilen kullanıcı hiçbir kanalda bulunmamaktadır.`;
        } else {
            desu = `${mentioned.voice.channel} \`${mentioned.voice.channel.members.size}/${mentioned.voice.channel.userLimit}\``;
            info = stripIndent`
            Kulaklığı ${mentioned.voice.selfDeaf ? "kapalı" : "açık"}
            Mikrofonu ${mentioned.voice.selfMute ? "kapalı" : "açık"}
            `
        }
        let lmc = message.guild.channels.cache.get(mentioned.lastMessageChannelID);
        if (!lmc) lmc = `Bulunamadı`;
        const embedi = embed.setDescription(`${mentioned} Anlık olarak\n\n**${desu}**\n\nEn son yazdığı kanal: ${lmc}\n${info}`);
        message.inlineReply(embedi);
    }
}

module.exports = Where;