const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Roles extends Command {
    constructor(client) {
        super(client, {
            name: "roller",
            description: "Sunucuda bulunan rolelri görüntüler",
            usage: "roller",
            examples: ["roller"],
            cooldown: 3600000,
            category: "Diğer",
            aliases: ["roles","kroles"],
            accaptedPerms: ["root","owner"],
            enabled: false
        });
    }
    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        const GREmbed = new Discord.MessageEmbed().setColor("Black");
        let guildRoles = message.guild.roles.cache.sort((kahve, stark) => kahve.position - stark.position).map(grol => `${grol.name} - (${grol.id})`).join("\n");
        await message.channel.send(GREmbed.setDescription(`${guildRoles}`, {split:true}));
    }
}

module.exports = Roles;