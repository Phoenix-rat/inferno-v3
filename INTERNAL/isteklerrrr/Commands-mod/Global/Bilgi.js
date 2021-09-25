const guild = require("../../../../Settings/guild")
var guldowns = new Map()
const { MessageEmbed } = require("discord.js")
const moment = require("moment")
module.exports.execute = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let renk;
    let renkRol = member.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0];
    if (!renkRol) {
        renk = '#ffffff';
    } else renk = renkRol.hexColor;
    let embed = new MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true })).setThumbnail(member.user.avatarURL({ dynamic: true })).setColor(renk)
    let presences = member.presence.status
        .replace('online', `Çevrim içi ${client.emoji("cevrimici")}`).replace('idle', `Boşta  ${client.emoji("bosta")}`).replace('dnd', `Rahatsız etmeyin  ${client.emoji("rahatsiz")}`).replace('offline', `Görünmez ${client.emoji("cevrimdisi")}`);

    embed.setDescription(`
**❯ __Kullanıcı Bilgisi__**
**ID:** ${member.id}
**Profil:** ${member}
**Durum:** ${presences}
**Oluşturulma:** ${moment(member.user.createdAt).format('DD.MM.YYYY H:mm')} (**\`${client.amcik(Date.now(), member.user.createdTimestamp)} önce\`**)

**❯ __Üyelik Bilgisi__**
**Sunucu takma adı:** ${member.displayName || member.user.username}
**Sunucuya katılma:** ${moment(member.joinedAt).format('DD.MM.YYYY H:mm')} (**\`${client.amcik(Date.now(), member.joinedTimestamp)} önce\`**)
**Sunucuya katılma sırası:** ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}
**Çevrim içi rolü:** ${member.roles.cache.array().filter(inf => inf.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0] ? member.roles.cache.array().filter(inf => inf.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0] : "Bulunamadı"}

**❯ __Kayıt Bilgisi__**
**Kayıt eden kullanıcı:** Yapılmadı.
**Kayıt olma tarihi:** ${moment(member.joinedTimestamp).format('DD.MM.YYYY H:mm')} (**\`${client.amcik(Date.now(), member.joinedTimestamp)} önce\`**) 
**Kayıt olma bilgileri:** ${member.displayName}`)
    await message.inlineReply(embed)

}
exports.conf = {
    command: "bilgi",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["info"],
    timeout: "7000"
}
