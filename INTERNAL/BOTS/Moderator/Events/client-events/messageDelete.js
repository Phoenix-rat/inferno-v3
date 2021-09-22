const low = require('lowdb');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
moment.locale("tr")
const msg_snipe = require("../../../../MODELS/Temprorary/Snipe.js");

class MessageDelete {
    constructor(client) {
        this.client = client;
    };
    async run(message) {
        const client = this.client;
        if (!message.guild) return;
        if (message.guild.id !== client.config.server) return;
        const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.executor.bot) return;
        await msg_snipe.create({
            _id: message.id,
            author: message.author.id,
            content: message.content,
            date: new Date(),
            channel: message.channel.id
        });
        const embed = new MessageEmbed()
        .setColor("BLACK").setFooter(`🌟 Tantoony sizi önemsiyor ❤ ${message.guild.name}`)
        .setDescription(`${message.author.toString()} tarafından bir mesaj silindi!`)
        .addField("**Mesaj İçeriği:**", `\`\`\`diff\n- ${message.content}\`\`\``)
        .addField("**Mesajı Silen Kişi:**", `\`\`\`fix\n${message.author.tag}\`\`\``, true)
        .addField("**Mesaj Kanalı:**", `\`\`\`fix\n${message.channel.name}\`\`\``, true)
        .addField("**İşlem Tarihi:**", `\`\`\`fix\n${moment(Date.now()).format("LLL")}\`\`\``, true);
        if ((entry.createdTimestamp > Date.now() - 1000) && (entry.executor.id !== message.author.id)) {
            return message.guild.channels.cache.get(channels.get("mesajlog").value()).send(embed);
        }
    }
}
module.exports = MessageDelete;