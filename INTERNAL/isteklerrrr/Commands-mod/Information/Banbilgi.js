const { MessageEmbed } = require("discord.js");
const Sicil = require("../../Datebase/Moderasyon/Sicil");
const moment = require("moment")
moment.locale("tr")
module.exports.execute = async (client, message, args) => {
    let banlanmis = args[0]
    if (!banlanmis) return message.react(client.emoji("red")).catch(() => { })
    const bannedUsers = await message.guild.fetchBans();
    const notban = bannedUsers.get(banlanmis);
    let embed = new MessageEmbed().setColor("#ffffff").setAuthor("Ban Bilgi", message.author.avatarURL({dynamic:true}))
    let kember = (await client.users.fetch(args[0]).catch(err => { return undefined; }))
    if (!notban) return message.inlineReply({ content: `Belirtmiş olduğunuz kullanıcı yasaklanmamış.`, allowedMentions: { repliedUser: true } }).catch(() => { })

    if (notban) {
        let sss = await Sicil.find({ member: banlanmis })
        if (sss) {
            let ss = sss.reverse().filter(a => a.type == "Ban")
            embed.setDescription(`
            \` • \` Yasaklanan: **${kember.tag}** (\`${banlanmis}\`)
            \` • \` Yasaklayan: <@${ss[0].auth}> (\`${ss[0].auth}\`)
            \` • \` Sebep: \`${ss[0].reason}\`
            \` • \` Yasaklanma Tarihi: \`${moment(ss[0].basla).format("LLL")}\``)
            message.inlineReply({ embed: embed, allowedMentions: { repliedUser: true } }).catch(() => { })
        } else return message.react(client.emoji("red")).catch(() => { })
    }




}
exports.conf = {
    command: "banbilgi",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["bansorgu"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner"]
}
