const moment = require("moment")
moment.locale("tr")
const KalkmazBan = require("../../Datebase/Moderasyon/KalkmazBan")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {

    let member = args[0];
    let reason = args.slice(1).join(' ') || "Belirtilmedi"
    const bannedUsers = await message.guild.fetchBans();
    const notban = bannedUsers.get(member);
    let kember = (await client.users.fetch(args[0]).catch(err => { return undefined; }))

    let kalkmaz = await KalkmazBan.findOne({ _id: member })
    let a = client.randomCeza()
    let cembed = new MessageEmbed().setColor("#d18100")

    if (kalkmaz && kalkmaz.kalkmazban) {
        let stark = ["853011311328100411", "484873072164208640", "317926888599453696"]
        if (!stark.some(a => message.author.id == a)) return message.inlineReply(`${message.member} Bu bir yargı banıdır. Sunucu sahipleri ve botcu harici kimse kaldıramaz.`)
        await KalkmazBan.deleteOne({ _id: member })
        client.channel("bannedLOG").send(cembed.setDescription(`**${kember.tag}** (\`${kember.id}\`) kullanıcısının **sunucudan yasaklanması** kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `).setFooter(`Ceza Numarası: ${a}`))
        await Sicil.findOneAndUpdate({  cno: a }, { member: member, type: "UnYargı", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })
        if (notban) await message.guild.members.unban(member, `[UNYARGI] ${message.member.user.tag}: ${reason}`);
        return;
    } 
    if (!notban) return message.react(client.emoji("red")).catch(() => { });
    await message.react(client.emoji("okey")).catch(() => { });
    await message.guild.members.unban(member, `${message.member.user.tag}: ${reason ||"sebep yok"}`);
    client.channel("bannedLOG").send(cembed.setDescription(`**${kember.tag}** (\`${kember.id}\`) kullanıcısının **sunucudan yasaklanması** kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `).setFooter(`Ceza Numarası: ${a}`))
    await Sicil.findOneAndUpdate({ cno: a }, { member: member, type: "UnBan", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })

}
exports.conf = {
    command: "unban",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["unban"],
    timeout: 7000,
    cmdPerms: ["cmdCiftHac", "cdmCeo", "cmdOwner"]
}
