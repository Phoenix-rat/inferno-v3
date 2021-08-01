const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Dj extends Command {

    constructor(client) {
        super(client, {
            name: "editör",
            description: "Belirtilen kullanıcıya özel üye rolü verir.",
            usage: "editör @Kahve/ID",
            examples: ["editör @Kahve/ID"],
            category: "Genel",
            aliases: ["edit"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const roleID = roles.get("role_editor").value();
        const myRole = message.guild.roles.cache.get(roleID);
        const embed = new Discord.MessageEmbed().setColor("RANDOM")
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${emojis.get("kullaniciyok").value()} Kişiyi bulunamadım.`).setColor('RANDOM'));
        if (!mentioned.roles.cache.has(roleID)) {
            await message.channel.send(embed
                .setDescription(`${mentioned} kişisine **${myRole.name}** adlı rolü başarıyla verdim!`));
            await mentioned.roles.add(myRole.id);
        } else {
            await mentioned.roles.remove(myRole.id);
            await message.channel.send(embed
            .setDescription(`${mentioned} kişisinden **${myRole.name}** adlı rolü başarıyla aldım!`));
        }
        await message.react(emojis.get("ok").value());
    }
}

module.exports = Dj;