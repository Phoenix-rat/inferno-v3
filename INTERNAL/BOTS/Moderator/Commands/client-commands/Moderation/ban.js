const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require('../../../../../HELPERS/functions');
const moment = require("moment")
moment.locale('tr')

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Belirtilen kullanıcıyı banlar",
            usage: "ban etiket/id gün/perma sebep",
            examples: ["ban 479293073549950997 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["yargı", "infaz"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double", "cmd-ban"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK')).then(msg => msg.delete({ timeout: 1000 }));
        }
        let sebep = args.slice(2).join(" ");
        let typo = "perma"
        // if (args[1] === 'perma') {
        //     sebep = args.slice(2).join(" ");
        //     typo = 'perma';
        //     args[1] = 0;
        // } else {
        //     typo = 'temp';
        // }
        if (!sebep) return message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("soru").value()} Bir sebep girmelisin`));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("missingPerms").value()} Bunu yapmak için yeterli yetkiye sahip değilsin`));
        if (!mentioned.bannable) return message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("miisingBotPerms").value()} Bu kişiye reklam cezası vermek için yeterli yetkiye sahip değilim`));
      //  if (!sayi(args[1])) {
      //      await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
      //      return message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("sayifalan").value()} Geçerli bir gün girmelisin`)).then(msg => msg.delete({ timeout: 1000 }));
      //  }
        client.extention.emit('Ban', message.guild, mentioned.user, message.author.id, sebep, typo, args[1]);
        await message.channel.send(`${mentioned} kullancısına başarıyla ban atıldı!`);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

        const logChannel = message.guild.channels.cache.get(channels.get("ban-log").value());
        const embed = new Discord.MessageEmbed()
        .setDescription(`${mentioned} (\`${mentioned.id}\`) üyesi ${message.author} tarafından sunucudan uzaklaştırıldı.

        • Banlanan Üye: ${mentioned ? mentioned.toString() : ""} \`(${mentioned.id})\`
        • Banlayan Yetkili: ${message.author} \`(${message.author.id})\`
        • Banlanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        • Banlanma Sebebi: \`${sebep}\``)
        .setColor('BLACK')
        .setFooter(`• Ban log felan filan -Kahve 🌟`)
        await logChannel.send(embed);
    }
}
module.exports = Ban;