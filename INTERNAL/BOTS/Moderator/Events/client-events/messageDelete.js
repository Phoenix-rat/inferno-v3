const low = require('lowdb');
const { MessageEmbed } = require('discord.js');
const moment = require('moment')
const msg_snipe = require("../../../../MODELS/Moderation/Snipe.js"); 
const config  = require("../../../../HELPERS/config.js")
class MessageDelete {
    constructor(client) {
        this.client = client;
    };
    async run(message) {
        const client = this.client;
        if (!message.guild) return;
        let prefix = message.content.startsWith(config.prefix)
        if (message.guild.id !== client.config.server) return;
        const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.executor.bot) return;
        await msg_snipe.findOneAndUpdate({ guildID: message.guild.id }, { $set: { author: message.author.id, content: message.content, date: Date.now(), channel: message.channel.id } }, { upsert: true })
        const embed = new MessageEmbed()
        .setColor("BLACK")
        .setDescription(`${message.author.toString()} tarafından bir mesaj silindi!`)
        .addField("**Mesajın içeriği:**" `\`\`\`\n${message.content}\`\`\``,)
        .addField("**Mesajı Silen Kişi:**", `\`\`\`fix\n${message.author.tag}\`\`\``, true)
        .addField("**Mesajın Kanalı:**", `\`\`\`fix\n${message.channel.name}\`\`\``, true)
        .addField("**Mesajın Silinme Tarihi:**", `\`\`\`fix\n${moment(Date.now()).format("LLL")}\`\`\``, true);
        if ((entry.createdTimestamp > Date.now() - 1000) && (entry.executor.id !== message.author.id)) {
            return message.guild.channels.cache.get(channels.get("mesajlog").value()).send(embed.addField("**Mesajı Silen Kişi**",  `\`\`\`fix\n${entry.executor.name}\`\`\``, true).addField("**Mesajın Kanalı**", `\`\`\`fix\n${message.channel.name}\`\`\``, true));
        } else {
            return message.guild.channels.cache.get(channels.get("mesajlog").value()).send(embed);
        }
    }
}
module.exports = MessageDelete;