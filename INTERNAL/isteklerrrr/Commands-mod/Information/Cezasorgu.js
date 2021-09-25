const moment = require("moment")
moment.locale("tr")
let { MessageEmbed } = require("discord.js")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
module.exports.execute = async (client, message, args) => {

    let cezano = args[0]
    if (!cezano) return message.react(client.emoji("red")).catch(() => { });
    // ctrl + c başla
    let renk;
    let renkRol = member.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0];
    if (!renkRol) {
        renk = '#ffffff';
    } else renk = renkRol.hexColor;
    //ctrl + v bitir
    let embed = new MessageEmbed().setAuthor(message.member.user.tag, message.member.user.avatarURL({ dynamic: true })).setThumbnail(message.member.user.avatarURL({ dynamic: true })).setColor(renk)
    let data = await Sicil.findOne({ cno: cezano })
    if (data) {
        embed.setDescription(`
    <@!${data.member}> kişisine uygulanan **${cezano}** numaralı ceza bilgisi;
    
    **Ceza Türü**
    ${data.type}

    **Ceza Atan Yetkili:**
    <@!${data.auth}>

    **Ceza Sebebi:**
    ${data.reason}

    **Ceza Başlangıcı:**
    ${moment(data.basla).format("LLL")}

    **Ceza Bitiş:**
    ${moment(data.bitis).format("LLL") ? moment(data.bitis).format("LLL") : "Kalıcı"}
    `)
    message.inlineReply(embed).catch(() => {}) 
    } else return message.react(client.emoji("red")).catch(() => { })


}
exports.conf = {
    command: "cezasorgu",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["cezasorgu"],
    timeout: "7000",
cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]
}
