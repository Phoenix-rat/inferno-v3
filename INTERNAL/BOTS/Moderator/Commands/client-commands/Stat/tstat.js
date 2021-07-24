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
            description: "Belirtilen segmenteki istatistiklerini gösterir",
            usage: "tstat ses/davet/teyit",
            examples: ["tstat ses/davet/teyit"],
            category: "Stats",
            aliases: ["t31","me"],
            accaptedPerms: ["crew"],
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
        if (!args[0] || (args[0] !== 'ses' && args[0] !== 'davet' && args[0] !== 'teyit')) return message.channel.send(embed.setDescription('.me ses/davet/teyit böyle kullana bilirsiniz')).then(x => x.delete({ timeout: 5000 }));
        if (args[0] === 'ses') {
            const Data = await StatData.findOne({ _id: mentioned.user.id });
            if (!Data) return message.channel.send(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`);
            const records = Data.records.filter(r => checkDays(r.enter) < days);
            const birim = [
                "Saat",
                "Dakika",
                "Saniye"
            ];
            const responseEmbed = new Discord.MessageEmbed().setDescription(stripIndent`
            ${mentioned} kişisine ait ${days} günlük ses bilgileri:

               **Not:** Bu sistem test amaçlı yapılmıştır komutun daha güncel ve daha iyi hali gelene kadar bir süre bununla idare ediniz seviyiorsunuz kahvelendiz <3.
            
            **Genel Bilgileri:**
            • ID: \`${mentioned.id}\`
            • Kullanıcı: ${mentioned}
            • Durum: ${tstatstatus}
            • Sunucuya Katılma Tarihi: \`${moment(mentioned.joinedAt).format("LLL")}\`
            • Geçirilen toplam süre : \`${new Date(records.map(r => r.duration).reduce((a, b) => a + b, 0) * 1000).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`

            **Ses Bilgileri:**
            • Public ses süresi: \`${new Date(records.filter(r => r.channelType === "st_public").map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`
            • Register ses süresi: \`${new Date(records.filter(r => r.channelType === "st_registry").map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`
            • Private ses süsresi: \`${new Date(records.filter(r => r.channelType === "st_private").map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`

            **Toplam Ses İstatistikleri**
            • Toplam ses: \`${new Date(records.map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`
            • Mikrofon kapalı: \`${new Date(records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`
            • Kulaklık kapalı: \`${new Date(records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => `${v} ${birim[i]}`).join(' ')}\`
         `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setFooter("• Kahve seni önemsiyor- vallaha önemsiyom abi").setTitle(message.guild.name);
            return await message.channel.send(responseEmbed).then(msg => msg.delete({ timeout: 20000 }));
        }

        if (args[0] === 'davet') {
            const DataInv = await InviteData.findOne({ _id: mentioned.user.id });
            if (!DataInv) return await message.channel.send(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`);
            const embed = new Discord.MessageEmbed().setColor('RANDOM').setDescription(stripIndent`
            • Kullanıcı: ${mentioned}
            • Toplam Davet sayısı: ${DataInv.records.length}
            • Sunucuda olan davet ettiği kişi sayısı: ${DataInv.records.filter(rec => message.guild.members.cache.get(rec.user)).length}
            `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle(message.guild.name);
            return await message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }));
        }

        if (args[0] === 'teyit') {
            const datam = await RegData.find({ executor: mentioned.user.id });
            if (!datam) return message.channel.send(`${emojis.get("kullaniciyok").value()} Data bulunamadı.`);
            const embedD = new Discord.MessageEmbed().setColor('RANDOM').setDescription(stripIndent`
            • Kullanıcı: ${mentioned}
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
