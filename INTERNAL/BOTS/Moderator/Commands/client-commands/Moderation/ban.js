const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require('../../../../../HELPERS/functions');
class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Belirtilen kullanıcıyı banlar",
            usage: "ban etiket/id gün/perma sebep",
            examples: ["ban 479293073549950997 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["yargı", "infaz"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-ceo"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136')).then(msg => msg.delete({ timeout: 1000 }));
        }
        let sebep = args.slice(2).join(" ");
        let typo;
        if (args[1] === 'perma') {
            typo = 'perma';
            args[1] = 0;
        } else {
            typo = 'temp';
        }
        if (!sebep) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.eachRight("soru").value()} Bir sebep girmelisin`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("missingPerms").value()} Bunu yapmak için yeterli yetkiye sahip değilsin`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (!mentioned.bannable) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("miisingBotPerms").value()} Bu kişiyi banlamak için yeterli yetkiye sahip değilim`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (!sayi(args[1])) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            return message.channel.send(new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("sayifalan").value()} Geçerli bir gün girmelisin`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        client.extention.emit('Ban', message.guild, mentioned.user, message.author.id, sebep, typo, args[1]);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        const embed = new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("ban").value()} ${mentioned} kullanıcısı ${message.member} tarafından banlandı!`);
        await logChannel.send(embed);
    }
}
module.exports = Ban;