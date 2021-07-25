const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require("../../../../../HELPERS/functions");
class Jail extends Command {
    constructor(client) {
        super(client, {
            name: "reklam",
            description: "Belirtilen kullanıcıyı reklam cezası ile hapse atar",
            usage: "reklam etiket/id sebep",
            examples: ["reklam 674565119161794560 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["rek", "req"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-jail"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        client = this.client;
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
        let sebep = args.slice(1).join(" ");
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
      //  if (!sayi(args[1]) && (args[1] !== 'perma')) return message.channel.send(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("sayifalan").value()} Geçerli bir gün girmelisin`));
      //  if ((typo !== 'perma') && (args[2] !== 'gün') && (args[2] !== 'saat')) return message.channel.send(new Discord.MessageEmbed().setDescription(`kullanım: ${this.info.usage}`));
      //  if (args[2] === 'saat') args[1] = args[1] / 24;
        client.extention.emit('Reklam', mentioned, message.author.id, sebep, typo);
        if (mentioned.voice.channel) await mentioned.voice.kick();
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-jail").value());
        const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("ok").value()} ${mentioned} kullanıcısı ${message.member} tarafından ${sebep} sebebiyle kalıcı olarak zindana şutlandı!`);
        await logChannel.send(embed);
    }
}
module.exports = Jail;