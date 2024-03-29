const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Gel extends Command {

    constructor(client) {
        super(client, {
            name: "gel",
            description: "İstediğiniz kişiyi odanıza çağırın",
            usage: "gel etiket/id",
            examples: ["gel 674565119161794560"],
            category: "Genel",
            aliases: ["çağır", "çek"],
            cmdChannel: "bot-komut",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'))
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (mentioned.user.id === message.member.user.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let kanal = message.member.voice.channel;
        if (!kanal) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!mentioned.voice || !mentioned.voice.channel) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (message.member.roles.cache.has(roles.get("owner").value() && (mentioned.voice.channel.parentID !== channels.get("st_private").value()))) return await mentioned.voice.setChannel(message.member.voice.channel.id);
        if (kanal.id === mentioned.voice.channel.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        try {
            await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        } catch (error) {
            console.error(error);
        }
        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = message.createReactionCollector(filter, {
            time: 120000
        });
        collector.on("collect", async (reaction, user) => {
            if (user.id !== mentioned.user.id) return reaction.users.remove(user);
            kanal = message.member.voice.channel;
            if (!kanal) {
                collector.stop();
                return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            }
            switch (reaction.emoji.id) {
                case emojis.get("ok").value().split(':')[2].replace('>', ''):
                    await mentioned.voice.setChannel(kanal.id);
                    collector.stop("ok");
                    break;
                case emojis.get("error").value().split(':')[2].replace('>', ''):
                    collector.stop();
                    break;
                default:
                    break;
            }
        });
        collector.on("end", async (collected, reason) => {
            if (reason === "ok") {
                return message.reactions.cache.find(r => r.emoji.id === emojis.get("error").value().split(':')[2].replace('>', '')).remove();
            } else {
                return message.reactions.cache.find(r => r.emoji.id === emojis.get("ok").value().split(':')[2].replace('>', '')).remove();
            }
        });
    }
}

module.exports = Gel;