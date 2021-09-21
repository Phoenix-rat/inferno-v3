const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const nameData = require('../../../../../MODELS/Datalake/Registered');
const low = require('lowdb');
const { stripIndents } = require('common-tags');
class KayitSil extends Command {
    constructor(client) {
        super(client, {
            name: "kayitsil",
            description: "Kayıt olan bir kullanıcıyı kayıtsıza atar ve o kullanıcının kaydını siler",
            usage: "kayitsil etiket/id",
            examples: ["kayitsil 674565119161794560"],
            category: "Kayıt",
            aliases: ["kayıtsil", "kayıtsız", "kayitsiz"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double"],
            cooldown: 10000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`Kullanıcı bulunamadı!`).setColor('BLACK'));

        const data = await nameData.findOne({ _id: mentioned.user.id });
        if (data) await nameData.deleteOne({ _id: mentioned.user.id });
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.channel.send(new Discord.MessageEmbed().setColor("BLACK").setDescription(`Bunu yapmak için yeterli yetkiye sahip değilsin`));
        await mentioned.roles.remove(mentioned.roles.cache.filter(r => r.editable).array());
        await mentioned.roles.add(roles.get('welcome').value());
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        const aylar = [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık"
        ];
        const tarih = new Date()
        await message.guild.channels.cache.get(channels.get("kayıt_log").value()).send(new Discord.MessageEmbed().setDescription(stripIndents`
        **Komutu kullanan:** ${message.member} (\`${message.member.user.id}\`)
        **Kayıtsıza atılan::** ${mentioned} (\`${mentioned.user.id}\`)
        **İsim/Yaş:** ${data.name} | ${data.age}
        **Cinsiyet:** \`${data.sex === "Male" ? "Erkek" : "Kız"}\`
        **Tag:** ${client.config.tag.some(t => mentioned.user.username.includes(t)) ? "\`Var\`" : "\`Yok\`"}
        **Tarih:** \`${tarih.getDate()} ${aylar[tarih.getMonth()]} ${tarih.getFullYear()} ${tarih.getHours() + 3}:${tarih.getMinutes()}\`
        `).setColor("#6be4a2").setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true })).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })));
    }
}
module.exports = KayitSil;