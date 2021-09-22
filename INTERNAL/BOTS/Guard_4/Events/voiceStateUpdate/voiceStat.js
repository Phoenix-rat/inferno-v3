const low = require('lowdb');
const { comparedate } = require('../../../../HELPERS/functions');
const VoiceRecords = require('../../../../MODELS/StatUses/VoiceRecords');
const Entries = require('../../../../MODELS/StatUses/voice_entires');
const vmutes = require('../../../../MODELS/Moderation/VoiceMuted');
const channelXp = require('../../../../MODELS/Economy/channelXp');
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
        const vmute = await vmutes.findOne({ _id: cur.member.user.id });
        if (vmute && !cur.serverMute) {
            await cur.setMute(true);
        }
        if (prev && cur && prev.selfMute && !cur.selfMute) {
            let uCooldown = client.trollwait[cur.member.user.id];
            if (!uCooldown) {
                client.trollwait[cur.member.user.id] = {};
                uCooldown = client.trollwait[cur.member.user.id];
            };
            let time = uCooldown[cur.channel.id] || 0;
            if (time && (time > Date.now())) {
                let uCount = client.trollcounts[cur.member.user.id];
                if (!uCount) {
                    this.client.trollcounts[cur.member.user.id] = {};
                    uCount = this.client.trollcounts[cur.member.user.id];
                };
                let count = uCount[cur.channel.id] || 0;
                if (count === 3) await cur.guild.channels.cache.get(channels.get("stat-warn").value()).send(`${emojis.get("voicespamwarn").value()} ${cur.member} Mikrofonun açıp kapamaya devam edersen sesli kanallardan susturulacaksın.`);
                if (count === 7) {
                    client.extention.emit("vMute", cur.member, this.client.user.id, "MIC-BUG", 5);
                    await cur.guild.channels.cache.get(channels.get("stat-warn").value()).send(`${emojis.get("voicespam").value()} ${cur.member} Mikrofonunu çok fazla açıp kapattığın için 5 dakika mutelendin!`);
                }
                this.client.trollcounts[cur.member.user.id][cur.channel.id] = count + 1;
            }
            this.client.trollwait[cur.member.user.id][cur.channel.id] = Date.now() + 3000;
        }
        let entry = await Entries.findOne({ _id: cur.member.user.id });
        if (!prev.channel) {
            if (!entry) return await Entries.create({
                _id: cur.member.user.id,
                created: new Date(),
                type: client.getPath(channels.value(), cur.channel.parentID),
                channelID: cur.channel.id,
                selfMute: cur.selfMute,
                serverMute: cur.serverMute,
                selfDeaf: cur.selfDeaf,
                serverDeaf: cur.serverDeaf,
                selfVideo: cur.selfVideo,
                streaming: cur.streaming
            });
            return await Entries.updateOne({ _id: cur.member.user.id }, {
                $set: {
                    created: new Date(),
                    type: client.getPath(channels.value(), cur.channel.parentID),
                    channelID: cur.channel.id,
                    selfMute: cur.selfMute,
                    serverMute: cur.serverMute,
                    selfDeaf: cur.selfDeaf,
                    serverDeaf: cur.serverDeaf,
                    selfVideo: cur.selfVideo,
                    streaming: cur.streaming
                }
            });
        }
        entry = await Entries.findOne({ _id: cur.member.user.id });
        if (entry) {
            const vData = await VoiceRecords.findOne({ _id: cur.member.user.id });
            if (!vData) await VoiceRecords.create({ _id: cur.member.user.id, records: [] });
            const condition = await channelXp.findOne({ _id: entry.channelID });
            let calValue = Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.digit : 1);
            if (entry.streaming) calValue = calValue + Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.streaming : 1);
            if (entry.videoOn) calValue = calValue + Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.videoOn : 1);
            if (entry.serverDeaf) calValue = calValue + Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.serverDeaf : 1);
            if (entry.selfDeaf) calValue = calValue + Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.selfDeaf : 1);
            if (entry.serverMute) calValue = calValue + Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.serverMute : 1);
            if (entry.selfMute) calValue = calValue + Math.floor(comparedate(entry.created) / 60000) * (condition ? condition.selfMute : 1);
            await VoiceRecords.updateOne({ _id: cur.member.user.id }, {
                $push: {
                    records: {
                        channelType: entry.type,
                        duration: comparedate(entry.created),
                        enter: entry.created,
                        exit: new Date(),
                        channelID: entry.channelID,
                        selfMute: entry.selfMute,
                        serverMute: entry.serverMute,
                        selfDeaf: entry.selfDeaf,
                        serverDeaf: entry.serverDeaf,
                        videoOn: entry.selfVideo,
                        streaming: entry.streaming,
                        xp: calValue
                    }
                }
            });
            if (!cur.channel) return await Entries.deleteOne({ _id: cur.member.user.id });
            await Entries.updateOne({ _id: cur.member.user.id }, {
                $set: {
                    created: new Date(),
                    type: client.getPath(channels.value(), cur.channel.parentID),
                    channelID: cur.channel.id,
                    selfMute: cur.selfMute,
                    serverMute: cur.serverMute,
                    selfDeaf: cur.selfDeaf,
                    serverDeaf: cur.serverDeaf,
                    selfVideo: cur.selfVideo,
                    streaming: cur.streaming
                }
            });
        }
    }
}
module.exports = VoiceStateUpdate;