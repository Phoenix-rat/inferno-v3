const BanS = require('../MODELS/Moderation/Ban');
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require('common-tags');

class PermaBanEvent {
    constructor(client) {
        this.client = client;
    };

    async run(guild, user, executor, reason, type, duration) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        await guild.members.ban(user, { reason: reason })
        const Ban = await BanS.findOne({ _id: user });
        if (!Ban) {
            let pban = new BanS({
                _id: user.id,
                executor: executor,
                reason: reason,
                type: type,
                duration: Number(duration) || 0,
                created: new Date()
            });
            await pban.save();
        }
        client.extention.emit('Record', user.id, executor, reason, "Ban", type, duration);
        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        **Banlayan:** ${guild.members.cache.get(executor)} (\`${executor}\`)
        **Banlanan:** ${user} (\`${user.id}\`)
        **Sebep:** ${reason || "Yok"}
        **Süresi:** ${type === "perma" ? "Sınırsız" : `${duration} gün`}
        `);
        await guild.channels.cache.get(channels.get("log_ban").value()).send(embed);
    }
}
module.exports = PermaBanEvent;
