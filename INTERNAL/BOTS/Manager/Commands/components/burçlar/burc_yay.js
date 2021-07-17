const Component = require("../../../Base/Component");
const Discord = require('discord.js');
const low = require('lowdb');
const private_channels = require("../../../../../MODELS/Temprorary/private_channels");

class RolSeçim extends Component {
    constructor(client) {
        super(client, {
            name: "burc_yay",
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
        const myRol = guild.roles.cache.get(roles.get("burc_yay").value());
        if (mentioned.roles.cache.has(myRol.id)) {
            await mentioned.roles.remove(myRol.id);
            return await ctx.send(`${myRol.name} rolü üzerinizden alındı`, {
                ephemeral: true
            });
        } else {
            await mentioned.roles.remove(Object.keys(roles.value()).filter(key => key.startsWith("burc_")).map(key => roles.get(key).value()));
            await mentioned.roles.add(myRol.id);
            return await ctx.send(`${myRol.name} rolü üzerinize verildi`, {
                ephemeral: true
            });
        }





    }
}

module.exports = RolSeçim;