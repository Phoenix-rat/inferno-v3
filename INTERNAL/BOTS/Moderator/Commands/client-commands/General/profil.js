const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain, checkDays } = require('../../../../../HELPERS/functions');
const vericik = require('../../../../../MODELS/Datalake/Registered');
const moment = require("moment")
moment.locale('tr');

class Anonim extends Command {

    constructor(client) {
        super(client, {
            name: "profil",
            description: "Kişinin kullanıcı bilgilerini gösterir",
            usage: "profil @etiket/id",
            examples: ["profil 674565119161794560"],
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!mentioned) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136'));

        const profildata = await vericik.findOne({ _id: mentioned.user.id });

        const embedd = new Discord.MessageEmbed().setDescription(stripIndent`
        **❯ Kullanıcı bilgisi:**

         ID: ${mentioned.id}
         Profil: ${mentioned}
         Durum: ${mentioned.presence.status.replace('online', 'Çevrim İçi <:inferno_cervimici:866719561944662016>').replace('idle', 'Boşta <:inferno_bostaa:866719581493526549>').replace('dnd', 'Rahatsız Etmeyin <:inferno_rahatsizetmeyin:866719649865269268>').replace('offline', 'Çevrim Dışı <:inferno_cevrimdisi:866719610303414292>')}
         Oluşturma Tarihi: ${moment(mentioned.user.createdAt).format("LLL")}
         (\`${moment(mentioned.user.createdAt).format("D [gün], H [saat], m [dakika]")}\`)

         **❯ Üyelik Bilgisi**

         Sunucu takma adı: ${mentioned.displayName}
         Sunucuya Katılma Tarihi: ${moment(mentioned.joinedAt).format("LLL")}
         (\`${moment(mentioned.user.createdAt).format("D [gün], H [saat], m [dakika]")}\`)
         Ayırıcı Rolü: ${mentioned.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0]}

         **❯ Kayıt Bilgisi**

         Kayıt eden kullanıcı: ${profildata ? message.guild.members.cache.get(profildata.executor) : "Bulunamadı"}
         Kayıt olma tarihi: ${profildata ? checkDays(profildata.created) + " gün önce" : "Bilinmiyor"}
         Kayıt olma bilgileri: ${profildata ? `${profildata.name} ${profildata.age} - ${profildata.sex}` : "Bulunamadı"}
        `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle("† Dante's INFEЯИO");
        await message.channel.send(embedd);
    }
}

module.exports = Anonim;