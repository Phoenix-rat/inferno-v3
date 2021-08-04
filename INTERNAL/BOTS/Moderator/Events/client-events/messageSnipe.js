const low = require('lowdb');
const { MessageEmbed } = require('discord.js');
const config = require("../../../../HELPERS/config.js")
const msg_snipe = require("../../../../MODELS/Moderation/Snipe.js") 
class MessageDelete {
    constructor(client) {
        this.client = client;
    };
    async run(message) {
        const client = this.client;
        let prefixli = message.content.startsWith(config.bot.prefix)
        if (!message.guild) return;

        if (message.guild.id !== client.config.server || message.author.bot || prefixli || !message.content) return;
        const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(logs => logs.entries.first());
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (entry.executor.bot) return;
        await msg_snipe.findOneAndUpdate({ _id: message.guild.id }, { $set: { author: message.author.id, content: message.content, date: Date.now(), channel: message.channel.id } }, { upsert: true })
    }
}
module.exports = MessageDelete;