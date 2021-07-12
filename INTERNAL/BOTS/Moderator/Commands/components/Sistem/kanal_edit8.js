const Component = require("../../../Base/Component");
const Discord = require('discord.js');
const low = require('lowdb');

class RolSeçim extends Component {
    constructor(client) {
        super(client, {
            name: "kanal_edit_8",
            channel: "kanal-edit",
            accaptedPerms: [],
            cooldown: 10000,
            enabled: true,
            ownerOnly: false,
            rootOnly: false,
            onTest: false,
            adminOnly: false
        });
    }

    async run(ctx) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const guild = client.guilds.cache.get(ctx.guildID);
        const mentioned = guild.members.cache.get(ctx.user.id);
        
        const voiceChannel = mentioned.voice.channel;
        if (!voiceChannel || (voiceChannel.parentID !== "857667607121756189")) return;
        const channelData = await private_channels.findOne({ _id: voiceChannel.id, owner: ctx.user.id });
        if (!channelData) return;
        await voiceChannel.setUserLimit(8)

    }
}

module.exports = RolSeçim;