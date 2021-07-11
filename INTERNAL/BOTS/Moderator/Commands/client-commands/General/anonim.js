const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Anonim extends Command {

    constructor(client) {
        super(client, {
            name: "anonim",
            description: "anonim olarak itirafta bulunun",
            usage: "anonim",
            examples: ["anonim cumaya gittim geleceğim"],
            cooldown: 3600000,
            dmCmd: true
        });
    }

    async run(client, message, args, data) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        let itiraf = args.join(' ');
        if (!itiraf) return message.channel.send(embed.setDescription(`${emojis.get("warn").value()} Geçerli bir itiraf girmedin!`));
        const kanal = client.channels.cache.get(channels.get("itiraf").value());
        kanal.send(new Discord.MessageEmbed().setDescription("Anonim: " + itiraf));
        await message.channel.send("Başarıyla gönderildi.");
        this.client.cmdCoodown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;

    }
}

module.exports = Anonim;