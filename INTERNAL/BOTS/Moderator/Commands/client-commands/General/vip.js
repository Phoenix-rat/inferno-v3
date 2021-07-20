const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Vip extends Command {

    constructor(client) {
        super(client, {
            name: "vip",
            description: "Bütün komutları kategoriye bölerek açıklar ya da belirtiklen komutu detaylandırır.",
            usage: "vip",
            examples: ["elite", ""],
            category: "Genel",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const verilecek = roles.get("vip").value();
        const verilen = message.guild.roles.cache.get(verilecek);

        const embed31 = new Discord.MessageEmbed();
        const fucktheuser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!fucktheuser) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('RANDOM'));
        if (!fucktheuser.roles.cache.has(verilecek)) {
            await message.channel.send(embed31
                .setDescription(`**${verilen.name}** rolü başarıyla ${fucktheuser} üyesine verildi!`));
            await fucktheuser.roles.add(verilen.id);;
        } else {
            await fucktheuser.roles.remove(verilen.id);
            await message.channel.send(embed31
            .setDescription(`**${verilen.name}** rolü başarıyla ${fucktheuser} üyesinden alındı!`));
        }
        await message.react(emojis.get("ok").value());
    }
}

module.exports = Vip;