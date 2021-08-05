const low = require('lowdb');
const { MessageEmbed } = require('discord.js');
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
        const embed = new MessageEmbed().setColor((entry.createdTimestamp < Date.now() - 1000) ? "#2f3136" : "RED").setDescription(`Mesajın içeriği:\n\`\`\`${message.content}\`\`\``).setTitle("Bir mesaj silindi").addField("Yazarı:", message.author, true);
        if ((entry.createdTimestamp > Date.now() - 1000) && (entry.executor.id !== message.author.id)) {
            return message.guild.channels.cache.get(channels.get("mesajlog").value()).send(embed.addField("Silen Kişi", entry.executor, true).addField("Kanal", message.channel, true));
        } else {
            return message.guild.channels.cache.get(channels.get("mesajlog").value()).send(embed.addField("Kanal", message.channel, true));
        }
    }
}
module.exports = MessageDelete;