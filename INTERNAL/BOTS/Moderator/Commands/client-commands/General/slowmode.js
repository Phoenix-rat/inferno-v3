const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Staffver extends Command {
    constructor(client) {
        super(client, {
            name: "slowmode",
            description: "Belirtilen roldeki üyeleri gösterir.",
            usage: "slowmode 1",
            examples: ["slowmode 1m"],
            category: "Yetkili",
            aliases: ["slow", "sm"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        
        const slowtime = args[0];
        if (!slowtime) return message.channel.send("Lütfen bir zaman belirt");
        if (isNaN(slowtime)) return message.channel.send("Bir sayı girmelisin");
        if (slowtime > 1000) return message.channel.send("En fazla 100 saniye slow atabilirsin");
        message.channel.setRateLimitPerUser(args[0]);
        message.channel.send(`Bu kanalda artık ${slowtime} saniye süresinde bir yazıla bilecek.`);
    }
}

module.exports = Staffver;