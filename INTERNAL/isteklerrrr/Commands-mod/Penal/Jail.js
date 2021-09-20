const guild = require("../../../../Settings/guild")
var guldowns = new Map()
const ms = require("ms")
const moment = require("moment")
moment.locale("tr")
const VoiceMute = require("../../Datebase/Moderasyon/VoiceMute")
const ChatMute = require("../../Datebase/Moderasyon/ChatMute")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const { MessageEmbed } = require("discord.js")
const Cezalar = require("../../Datebase/Moderasyon/Cezalar")
const Jail = require("../../Datebase/Moderasyon/KalkmazJail")
const tarihim = new Date()
module.exports.execute = async (client, message, args) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })
    let reason = args.slice(1).join(' ') || "Belirtilmedi"

    if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
    if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
    if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
    if (!member.roles.cache.get(client.role("regWoMans")) && !member.roles.cache.get(client.role("regMans")) && !member.roles.cache.get(client.role("regUnreg"))) return message.react(client.emoji("red")).catch(() => { })

    let a = client.randomCeza()
    let chatembed = new MessageEmbed().setColor("#ff0000")


    if (member.roles.cache.has(client.role("regWoMans"))) {
        await Jail.findOneAndUpdate({ _id: member.id }, { $set: { type: "Perm Jail", enabled: true, reason: reason, cno: a, sex: "Female" } }, { upsert: true })
        await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Perm Jail", auth: message.author.id, basla: Date.now(), reason: reason,  }, { upsert: true })

        member.roles.remove(client.role("regWoMans")).catch(() => { })
        member.roles.add(client.role("jailed")).catch(() => { })
        await client.channel("jailLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuda kalıcı cezalandırıldı! \n\` • \`  Cezalandıran Yetkili: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
        await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından cezalandırıldın! \`${a}\``).catch(() => { })
        message.react(client.emoji("okey")).catch(() => { })
    } else
        if (member.roles.cache.has(client.role("regMans"))) {
            await Jail.findOneAndUpdate({ _id: member.id }, { $set: { type: "Perm Jail", enabled: true, reason: reason, cno: a, sex: "Male" } }, { upsert: true })
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Perm Jail", auth: message.author.id, basla: Date.now(),  reason: reason,   }, { upsert: true })

            member.roles.remove(client.role("regMans")).catch(() => { })
            member.roles.add(client.role("jailed")).catch(() => { })
            await client.channel("jailLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuda kalıcı cezalandırıldı! \n\` • \`  Cezalandıran Yetkili: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
            await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından cezalandırıldın! \`${a}\``).catch(() => { })
            message.react(client.emoji("okey")).catch(() => { })

        } else
            if (member.roles.cache.has(client.role("regUnreg"))) {
                await Jail.findOneAndUpdate({ _id: member.id }, { $set: { type: "Perm Jail", enabled: true, reason: reason, cno: a, sex: "Unregister" } }, { upsert: true })
                await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Perm Jail", auth: message.author.id, basla: Date.now(), reason: reason,  }, { upsert: true })

                member.roles.remove(client.role("regUnreg")).catch(() => { })
                member.roles.add(client.role("jailed")).catch(() => { })
                await client.channel("jailLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcı sunucuda kalıcı cezalandırıldı! \n\` • \`  Cezalandıran Yetkili: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
                await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından cezalandırıldın! \`${a}\``).catch(() => { })
                message.react(client.emoji("okey")).catch(() => { })
            }

}
exports.conf = {
    command: "jail",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["jail"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdJail"]
}
