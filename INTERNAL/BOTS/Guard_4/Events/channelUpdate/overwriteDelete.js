const Permissions = require("../../../../MODELS/Temprorary/Permissions");
const low = require('lowdb');
const {closeall} = require("../../../../HELPERS/functions");
const Discord = require('discord.js');
const overwrites = require("../../../../MODELS/Datalake/Overwrites");

class ChannelUpdate {
    constructor(client) {
        this.client = client;
    };

    async run(oldChannel, curChannel) {
        const client = this.client;
        if (curChannel.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const entry = await curChannel.guild.fetchAuditLogs({type: "CHANNEL_OVERWRITE_DELETE"}).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 1000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.target.id !== curChannel.id) return;
        const permission = await Permissions.findOne({user: entry.executor.id, type: "overwrite", effect: "channel"});
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await Permissions.updateOne({
                user: entry.executor.id,
                type: "overwrite",
                effect: "channel"
            }, {$inc: {count: -1}});
            const document = await overwrites.findOne({_id: curChannel.id});
            if (!document) {
                const newData = new overwrites({_id: curChannel.id, overwrites: []});
                await newData.save();
            } else {
                const data = document.overwrites.find(o => o.id === entry.changes[0].old);
                await overwrites.updateOne({_id: curChannel.id}, {$pull: {overwrites: data}});
            }
            return client.extention.emit('Logger', 'Guard', entry.executor.id, "CHANNEL_OVERWRITE_DELETE", `${curChannel.name} isimli kanalda izin sildi. Kalan izin sayısı ${permission.count - 1}`);
        }
        await Permissions.deleteOne({user: entry.executor.id, type: "overwrite", effect: "channel"});
        await closeall(curChannel.guild, ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        const overwrits = await overwrites.findOne({_id: curChannel.id});
        const data = overwrits.overwrites.find(o => o.id === entry.changes[0].old);
        const options = {};
        new Discord.Permissions(data.allow.bitfield).toArray().forEach(p => options[p] = true);
        new Discord.Permissions(data.deny.bitfield).toArray().forEach(p => options[p] = false);
        await curChannel.updateOverwrite(entry.changes[0].old, options);
        const exeMember = curChannel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('PermaJail', exeMember, client.user.id, "KDE - İzin Silme", "Perma", 0);
        client.extention.emit('Logger', 'KDE', entry.executor.id, "CHANNEL_OVERWRITE_DELETE", `${oldChannel.name} isimli kanalın izinleriyle oynadı`);
    }
}

module.exports = ChannelUpdate;