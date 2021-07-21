const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
class Lock extends Command {

    constructor(client) {
        super(client, {
            name: "lock",
            description: "Mesajın atıldığı kanalı kilitler",
            usage: "lock",
            examples: ["lock"],
            cooldown: 3600000,
            category: "Düzen",
            accaptedPerms: ["cmd-single", "cmd-double", "cmd-ceo"]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const everyone = message.channel.permissionsFor(message.guild.id).has("SEND_MESSAGES");

        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setDescription(`Başarılı bir şekilde kanal \`${everyone ? "kilitlendi" : "açıldı"}!\``)
        );
        message.channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGES: !everyone,
        });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

    }

}

module.exports = Lock;