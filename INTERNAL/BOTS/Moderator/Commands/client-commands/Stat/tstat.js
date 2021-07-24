const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
const StatData = require('../../../../../MODELS/StatUses/VoiceRecords');
const InviteData = require('../../../../../MODELS/StatUses/Invites');
const RegData = require('../../../../../MODELS/Datalake/Registered');
const { stripIndent } = require('common-tags');
const stringTable = require('string-table');
const moment = require("moment")
moment.locale('tr');

class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "tstat",
            description: "Belirtilen kullanıcının istatistiklerini gösterir",
            usage: "tstat @etiket/id",
            examples: ["tstat 674565119161794560"],
            category: "Stats",
            aliases: ["t31"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;        

        let tstatstatus = mentioned.presence.status
        .replace('online', 'Çevrim İçi <:inferno_cervimici:866719561944662016>')
        .replace('idle', 'Boşta <:inferno_bostaa:866719581493526549>')
        .replace('dnd', 'Rahatsız Etmeyin <:inferno_rahatsizetmeyin:866719649865269268>')
        .replace('offline', 'Çevrim Dışı <:inferno_cevrimdisi:866719610303414292>');

        if (mentioned.user.id !== message.author.id) args = args.slice(1);
        let days = args[2] || 7;

        const embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }));
        if (!args[0] || (args[0] !== 'ses' && args[0] !== 'davet' && args[0] !== 'teyit')) return message.channel.send(embed.setDescription('Stat seçimi pls (ses/chat/teyit)')).then(x => x.delete({timeout: 5000}));
        if (args[0] === 'ses') {
            const Data = await StatData.findOne({ _id: mentioned.user.id });
            if (!Data) return ctx.send(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`);
            const records = Data.records.filter(r => checkDays(r.enter) < days);
            const responseEmbed = new Discord.MessageEmbed().setDescription(stripIndent`
            ${mentioned} kişisine ait ${days} günlük ses bilgileri:
               **Not:** Bu sistem henüz test amaçlı yapılmıştır komutun daha güncel ve daha iyi hali gelene kadar bir süre bununla idare ediniz seviyiorsunuz kahvelendiz <3.
            
            **Genel Bilgileri:**
            • ID: ${mentioned.id}
            • Kullanıcı: ${mentioned}
            • Durum: ${tstatstatus}
            • Sunucuya Katılma Tarihi: \`${moment(mentioned.joinedAt).format("LLL")}\`
            • Geçirilen toplam süre : \`${Math.floor(records.map(r => r.duration).length > 0 ? records.map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`

            **Ses Bilgileri:**
            • Public ses süresi: \`${Math.floor(records.filter(r => r.channelType === "st_public").map(r => r.duration).length > 0 ? records.filter(r => r.channelType === "st_public").map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
            • Register ses süresi: \`${Math.floor(records.filter(r => r.channelType === "st_registry").map(r => r.duration).length > 0 ? records.filter(r => r.channelType === "st_registry").map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
            • Private ses süsresi: \`${Math.floor(records.filter(r => r.channelType === "st_private").map(r => r.duration).length > 0 ? records.filter(r => r.channelType === "st_private").map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`

            **Toplam Ses İstatistikleri**
            • Toplam ses: \`${Math.floor(records.map(r => r.duration).length > 0 ? records.map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
            • Mikrofon kapalı: \`${Math.floor(records.filter(r => r.selfMute).map(r => r.duration).length > 0 ? records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
            • Kulaklık kapalı: \`${Math.floor(records.filter(r => r.selfDeaf).map(r => r.duration).length > 0 ? records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
            • Yayın Açık: \`${Math.floor(records.filter(r => r.streaming).map(r => r.duration).length > 0 ? records.filter(r => r.streaming).map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
            • Kamera Açık: \`${Math.floor(records.filter(r => r.videoOn).map(r => r.duration).length > 0 ? records.filter(r => r.streaming).map(r => r.duration).reduce((a, b) => a + b) / 60000 : 0)} dakika\`
         `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle(message.guild.name);
            return await message.channel.send(responseEmbed).then(msg => msg.delete({ timeout: 10000 })); 
        }

        if (args[0] === 'davet') {
            const DataInv = await InviteData.findOne({ _id: mentioned.user.id });
            if (!DataInv) return await ctx.send(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`);
            const embed = new Discord.MessageEmbed().setColor('RANDOM').setDescription(stripIndent`
            • Kullanıcı: **${mentioned.user.username}**
            • Toplam Davet sayısı: ${DataInv.records.length}
            • Sunucuda olan davet ettiği kişi sayısı: ${DataInv.records.filter(rec => message.guild.members.cache.get(rec.user)).length}
            `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle(message.guild.name);
            return await message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }));
        }

        if (args[0] === 'teyit') {
            const datam = await RegData.find({ executor: mentioned.user.id });
            if (!datam) return ctx.send(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`);
            const embedD = new Discord.MessageEmbed().setColor('RANDOM').setDescription(stripIndent`
            • Kullanıcı: **${mentioned.user.username}**
            • Toplam Kayıt sayısı: ${rain(client, datam.length)}
            • Bugünkü kayıt sayısı: ${rain(client, datam.filter(data => checkDays(data.created) <= 1).length)} 
            • Haftalık kayıt sayısı: ${rain(client, datam.filter(data => checkDays(data.created) <= 7).length)} 
            `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle(message.guild.name);
            return await message.channel.send(embedD).then(msg => msg.delete({ timeout: 10000 }));
        }
        return message.channel.send(embed.setDescription('istatistik bla bla bla'));    
    }
}
module.exports = Invites;