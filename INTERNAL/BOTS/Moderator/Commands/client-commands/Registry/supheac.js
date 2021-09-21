const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const { rain, checkDays } = require('../../../../../HELPERS/functions');
const { stripIndents } = require('common-tags');
class Supheac extends Command {
    constructor(client) {
        super(client, {
            name: "supheac",
            description: "Şüpheli bir üyeyi kayıtsıza alır",
            usage: "supheac etiket/id",
            examples: ["supheac 674565119161794560"],
            category: "Kayıt",
            aliases: ["şüpheaç", "şüphemyok", "şüpheli"],
            cmdChannel: "suspicious",
            accaptedPerms: ["cmd-registry", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!mentioned.roles.cache.has(roles.get("suspicious").value())) return await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await mentioned.roles.remove(roles.get("suspicious").value());
        await mentioned.roles.add(roles.get("welcome").value());
        await message.guild.channels.cache.get(channels.get("welcome").value()).send(embed);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //await message.guild.channels.cache.get(channels.get("mod-registry").value()).send(new Discord.MessageEmbed().setDescription(`${message.member} yetkilisi ${mentioned} kullanıcısının şüphesini kaldırdı.`));
        await message.channel.send(`${mentioned} adlı kullanıcı başarıyla şüpheliden çıkarıldı.`);

    }
}
module.exports = Supheac;