const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
class Move extends Command {

    constructor(client) {
        super(client, {
            name: "kanalçek",
            description: "Bir kanalda bulunan kişileri toplu olarak kendi kanalına taşır",
            usage: "kanalçek kanalid/etiket/id",
            examples: ["kanalçek 718265023750996028"],
            cooldown: 3600000,
            category: "Düzen",
            accaptedPerms: ["cmd-transport", "cmd-all"]
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (!message.member.voice.channel) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!args[0]) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const goingto = message.guild.channels.cache.get(message.member.voice.channel.id);
        const channel = message.mentions.members.first() ? message.guild.channels.cache.get(message.mentions.members.first().voice.channel.id) : (message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.get(message.guild.members.cache.get(args[0]).voice.channel.id));
        if (!goingto) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        channel.members.forEach(async mem => {
            await mem.voice.setChannel(goingto.id);
        });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));


    }

}

module.exports = Move;