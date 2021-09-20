const moment = require("moment")
moment.locale("tr")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const { MessageEmbed } = require("discord.js")
const role = require("../../../../Settings/roles")
const KalkmazJail = require("../../Datebase/Moderasyon/KalkmazJail")
const TempJail = require("../../Datebase/Moderasyon/TempJail")
TempJail
module.exports.execute = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })
    let reason = args.slice(1).join(' ') || "Belirtilmedi"
    if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })

    let kalicijailsorgu = await KalkmazJail.findOne({ _id: member.id })
    let tempjailsorgu = await TempJail.findOne({ _id: member.id })
    let cembed = new MessageEmbed().setColor("#d18100")

    if (kalicijailsorgu) {
        if (kalicijailsorgu.sex == "Male") {
            member.roles.remove(client.role("jailed")).catch(() => { })
            member.roles.add(client.role("regMans")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnJail", auth: message.author.id, basla: Date.now(), reason: reason}, { upsert: true })
            await KalkmazJail.deleteOne({ _id: member.id })
            client.channel("jailLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **kalıcı** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
            message.react(client.emoji("okey")).catch(() => { });

        } else 
        if (kalicijailsorgu.sex == "Female") {
            member.roles.remove(client.role("jailed")).catch(() => { })
            member.roles.add(client.role("regWoMans")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnJail", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })
            await KalkmazJail.deleteOne({ _id: member.id })
            client.channel("jailLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **kalıcı** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
            message.react(client.emoji("okey")).catch(() => { });

        } else 
        if (kalicijailsorgu.sex == "Unregister") {
            member.roles.remove(client.role("jailed")).catch(() => { })
            member.roles.add(client.role("regUnreg")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnJail", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })
            await KalkmazJail.deleteOne({ _id: member.id })
            client.channel("jailLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **kalıcı** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
            message.react(client.emoji("okey")).catch(() => { });

        }
    } else 
    if (tempjailsorgu) {
        if (tempjailsorgu.sex == "Male") {
            member.roles.remove(client.role("jailed")).catch(() => { })
            member.roles.add(client.role("regMans")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { $push: { sicil: { member: member.id, type: "UnJail", auth: message.author.id, basla: Date.now(), reason: reason } } }, { upsert: true })
            await TempJail.deleteOne({ _id: member.id })
            client.channel("jailLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **süreli** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
            message.react(client.emoji("okey")).catch(() => { });

        } else 
        if (tempjailsorgu.sex == "Female") {
            member.roles.remove(client.role("jailed")).catch(() => { })
            member.roles.add(client.role("regWoMans")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnJail", auth: message.author.id, basla: Date.now(), reason: reason } , { upsert: true })
            await TempJail.deleteOne({ _id: member.id })
            client.channel("jailLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **süreli** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
            message.react(client.emoji("okey")).catch(() => { });

        } else 
        if (tempjailsorgu.sex == "Unregister") {
            member.roles.remove(client.role("jailed")).catch(() => { })
            member.roles.add(client.role("regUnreg")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "UnJail", auth: message.author.id, basla: Date.now(), reason: reason }, { upsert: true })
            await TempJail.deleteOne({ _id: member.id })
            client.channel("jailLOG").send(cembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) kullanıcısının **süreli** cezası kaldırıldı. \n\` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`) \n \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\` `))
            message.react(client.emoji("okey")).catch(() => { });

        }
    }
}
exports.conf = {
    command: "unjail",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["unjail"],
    timeout: "7000",
    cmdPerms: ["cmdCiftHac", "cdmCeo", "cmdOwner"]
}


//     _id: String,
//     type: String,
//     enabled: Boolean,
//     reason: String,
//     date: Number,
//     cno: Number,
//     sex: String


    //  _id: String,
    //  type: String,
    //  enabled: Boolean,
    //  reason: String,
    //  date: Number,
    //  cno: Number,
    //  sex: String

