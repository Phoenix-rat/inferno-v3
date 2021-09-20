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
const tarihim = new Date()
module.exports.execute = async (client, message, args) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    //if (!member || !args[0]) return message.react(client.emoji("red")).catch(() => { })

    if (message.member.hasPermission("ADMINISTRATOR")) {
        let reason = args.slice(1).join(' ') || "Belirtilmedi"
        if (!args[0]) return message.react(client.emoji("red")).catch(() => { })
        if (!member && !message.guild.members.cache.get(args[0])) {
            if (args[0] == message.author.id) return message.react(client.emoji("red")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, {  member: args[0], type: "Ban", auth: message.author.id, basla: Date.now(), reason: reason,   }, { upsert: true })
            message.guild.members.ban(args[0], {  reason: `${message.author.tag}: ${reason}` }).catch(() => { })
            message.react(client.emoji("okey")).catch(() => { });
            let chatembed = new MessageEmbed().setColor("#ff0000")
            let kember = (await client.users.fetch(args[0]).catch(err => { return undefined; }))
            client.channel("bannedLOG").send(chatembed.setDescription(`**${kember.tag}** (\`${kember.id}\`) adlı kullanıcısı sunucudan yasaklandı! \n\` • \`  Yasaklayan : ${message.member} (\`${message.member.id}\`)
            \` • \` Sebep: \`${reason}\`
            \` • \` Yasaklanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
            `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
        }
        if (member) {
            if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
            if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
            if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Ban", auth: message.author.id, basla: Date.now(), reason: reason,  }, { upsert: true })
            message.react(client.emoji("okey")).catch(() => { });
            let chatembed = new MessageEmbed().setColor("#ff0000")

            await client.channel("bannedLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucudan yasaklandı! \n\` • \`  Yasaklayan : ${message.member} (\`${message.member.id}\`)
            \` • \` Sebep: \`${reason}\`
            \` • \` Yasaklanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
            `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })

            await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından yasaklandın! \`${a}\``).catch(() =>{})

            await message.guild.members.ban(`${member.id}`, { reason: `${message.author.tag}: ${reason}` }).catch(() => { })

        }
    } else {
        let reason = args.slice(1).join(' ') || "Belirtilmedi"
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
        if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
        if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
        let a = client.randomCeza()
        await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Ban", auth: message.author.id, basla: Date.now(), reason: reason,  }, { upsert: true })
        message.react(client.emoji("okey")).catch(() => { });
        let chatembed = new MessageEmbed().setColor("#ff0000")

        await client.channel("bannedLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucudan yasaklandı! \n\` • \`  Yasaklayan: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Yasaklanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
        await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından yasaklandın! \`${a}\``).catch(() =>{})
        await message.guild.members.ban(`${member.id}`, { reason: `${message.author.tag}: ${reason}` }).catch(() => { })

    }

}
exports.conf = {
    command: "ban",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["ban"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdBan"]
}
