const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Lust extends Command {

    constructor(client) {
        super(client, {
            name: "lust",
            description: "Belirtilen kullanıcıya Lust permini verir verir.",
            usage: "lust @Kahve/ID",
            examples: ["lust @Kahve/ID"],
            category: "Genel",
            aliases: ["lt"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double","cmd-single","yetkilialım","yetkilialımcoach"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const embed = new Discord.MessageEmbed().setColor("RANDOM")
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed()
        .setDescription(`${emojis.get("kullaniciyok").value()} Kişiyi bulunamadım.`).setColor('RANDOM'));
        if (!mentioned.roles.cache.has(roles.get("starter").value().concat(roles.get("cmd-crew").value()))) {
            await message.channel.send(embed
                .setDescription(`${mentioned} kişisine "**Lust**" yetkisine çıkardım!`));
            await mentioned.roles.add(roles.get("starter").value().concat(roles.get("cmd-crew").value()));
        } else {
            await mentioned.roles.remove(roles.get("starter").value().concat(roles.get("cmd-crew").value()));
            await message.channel.send(embed
            .setDescription(`${mentioned} kişisini "**Lust**" yetkisinden indirdim!`));
        }
        await message.react(emojis.get("ok").value());
    }
}

module.exports = Lust;