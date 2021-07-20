const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Vip extends Command {

    constructor(client) {
        super(client, {
            name: "vip",
            description: "Belirtilen kullanıcıya özel üye rolü verir.",
            usage: "Vip @Kahve/ID",
            examples: ["Vip @Kahve/ID"],
            category: "Genel",
            aliases: ["vib", "elite"],
            accaptedPerms: ["cmd-mute", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const embed31 = new Discord.MessageEmbed();
        const gluklan = roles.get("vip").value();
        const glukglukgluk = message.guild.roles.cache.get(gluklan);
        const embed31 = new Discord.MessageEmbed();
        const fucktheuser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!fucktheuser) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('RANDOM'));
        if (!fucktheuser.roles.cache.has(gluklan)) {
            await message.channel.send(embed31
                .setDescription(`**${glukglukgluk.name}** rolü başarıyla ${fucktheuser} üyesine verildi!`));
            await fucktheuser.roles.add(glukglukgluk.id);
        } else {
            await fucktheuser.roles.remove(glukglukgluk.id);
            await message.channel.send(embed31
            .setDescription(`**${glukglukgluk.name}** rolü başarıyla ${fucktheuser} üyesinden alındı!`));
        }
        await message.react(emojis.get("ok").value());
    }
}

module.exports = Vip;