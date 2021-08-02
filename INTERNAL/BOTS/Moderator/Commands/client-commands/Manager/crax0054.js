const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');

class Crax extends Command {
    constructor(client) {
        super(client, {
            name: "crax",
            description: "0054 Üyelerine özel rol verir.",
            usage: "crax @member/ID",
            examples: ["crax"],
            category: "Yetkili",
            aliases: ["0054"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.react(emojis.get("warn").value().split(':')[2].replace('>', ''));
        if (member.roles.cache.has("871446895665491978")) return message.reply("Kullanıcıda zaten perm var bilader amacın ne ?").catch(() => { })

        member.roles.add("871446895665491978").catch(() => { })
        message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

    }
}
module.exports = Crax;