const Component = require("../../../Base/Component");
const Discord = require('discord.js');
const low = require('lowdb');
const private_channels = require("../../../../../MODELS/Temprorary/private_channels");

class RolSeçim extends Component {
    constructor(client) {
        super(client, {
            name: "burc_basak",
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
        let array = [
            "854097699649224714",
            "854097673355395073",
            "854098313951707166",
            "854097674005119037",
            "854098313375907870",
            "854097674977935422",
            "854097675976441916",
            "854097674801643560",
            "854097677200523294",
            "854097676546342942",
            "854096841616654388"

        ]

        if (array.some(a => message.member.roles.cache.has(a))) {
            return await ctx.send(`Şu anda bir burç rolü olduğundan iptal edildi.`, {
                ephemeral: true
            })
        }
        const myRol = guild.roles.cache.get(roles.get("burc_basak").value());
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