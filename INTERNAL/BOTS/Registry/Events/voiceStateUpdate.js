const low = require('lowdb');
const private_channels = require('../../../MODELS/Temprorary/private_channels');

class VoiceStateUpdate {
    constructor(client) {
        this.client = client;
    }
    async run(prev, cur) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (prev && prev.channel && cur && cur.channel && (cur.channel.id === prev.channel.id)) return;
        const channel = client.guild.channels.cache.get(channels.get("oda_olustur").value());
        if (prev && prev.channel && (prev.channel.parentID === channel.parentID) && (prev.channel.id !== channel.id)) {
            const syncChannel = client.guild.channels.cache.get(prev.channel.id);
            if (syncChannel.members.size === 0) await syncChannel.delete();
            await private_channels.deleteOne({ _id: syncChannel.id });
        }
        if (cur && cur.channel && (cur.channel.id === channel.id)) {
            const nueva = await channel.clone({
                name: cur.member.displayName,
                userLimit: 1,
                permissionOverwrites: [
                    {
                        id: client.guild.roles.everyone.id,
                        allow: [],
                        deny: ["MOVE_MEMBERS"]
                    },
                    {
                        id: cur.member.user.id,
                        allow: ["MOVE_MEMBERS"],
                        deny: []
                    },
                    {
                        id: roles.get("musicbots").value(),
                        allow: ["CONNECT", "MOVE_MEMBERS"],
                        deny: []
                    }
                ]
            });
            await private_channels.create({ _id: nueva.id, owner: cur.member.user.id });
            await cur.member.voice.setChannel(nueva.id);
        }
    }
}
module.exports = VoiceStateUpdate;