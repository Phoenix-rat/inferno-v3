const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class BinDortYuzElliSekiz extends Command {

    constructor(client) {
        super(client, {
            name: "bindortyuzellisekiz",
            description: "1458 Üyelerine özel rol verir.",
            usage: "bindortyuzellisekiz @member/ID",
            examples: ["bindortyuzellisekiz"],
            category: "Yetkili",
            aliases: ["1458"],
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

        if (member.roles.cache.has("870076552610717706")) return message.reply("Kullanıcıda zaten perm var bilader amacın ne ?").catch(() => { })

        member.roles.add("870076552610717706").catch(() => { })
        message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

    }
}
module.exports = BinDortYuzElliSekiz;