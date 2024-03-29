const moment = require("moment")
moment.locale("tr")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const { MessageEmbed } = require("discord.js")
const KalkmazBan = require("../../Datebase/Moderasyon/KalkmazBan")
module.exports.execute = async (client, message, args) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    //if (!member || !args[0]) return message.react(client.emoji("red")).catch(() => { })

    if (message.member.hasPermission("ADMINISTRATOR")) {
        let reason = args.slice(1).join(' ') || "Belirtilmedi"
        if (!args[0]) return message.react(client.emoji("red")).catch(() => { })
        if (!member && !message.guild.members.cache.get(args[0])) {
            if (args[0] == message.author.id) return message.react(client.emoji("red")).catch(() => { })
            let a = client.randomCeza()
            await Sicil.findOneAndUpdate({ cno: a }, { member: args[0], type: "Ban", auth: message.author.id, basla: Date.now(), reason: reason, }, { upsert: true })
            await KalkmazBan.findOneAndUpdate({ _id: args[0] }, { $set: { kalkmazban: true, reason: reason, cno: a } }, { upsert: true })
            message.guild.members.ban(args[0], {  reason: `[YARGI] ${message.author.tag}: ${reason}` }).catch(() => { })
            message.react(client.emoji("okey")).catch(() => { });
            let chatembed = new MessageEmbed().setColor("#ff0000")
            let kember = (await client.users.fetch(args[0]).catch(err => { return undefined; }))
            client.channel("bannedLOG").send(chatembed.setDescription(`**${kember.tag}** (\`${kember.id}\`) adlı kullanıcısı sunucudan yasaklandı! \n\` • \`  Yasaklıyan : ${message.member} (\`${message.member.id}\`)
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
            await KalkmazBan.findOneAndUpdate({ _id: member.id }, { $set: { kalkmazban: true, reason: reason, cno: a } }, { upsert: true })

            message.react(client.emoji("okey")).catch(() => { });
            let chatembed = new MessageEmbed().setColor("#ff0000")

            await client.channel("bannedLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucudan yasaklandı! \n\` • \`  Yasaklıyan : ${message.member} (\`${message.member.id}\`)
            \` • \` Sebep: \`${reason}\`
            \` • \` Yasaklanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
            `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })

            await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından yasaklandın! \`${a}\``).catch(() => { })

            await message.guild.members.ban(`${member.id}`, { reason: `[YARGI] ${message.author.tag}: ${reason}` }).catch(() => { })

        }
    } else {
        let reason = args.slice(1).join(' ') || "Belirtilmedi"
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
        if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
        if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
        let a = client.randomCeza()
        await Sicil.findOneAndUpdate({ cno: a },{ member: member.id, type: "Ban", auth: message.author.id, basla: Date.now(), reason: reason,}, { upsert: true })
        await KalkmazBan.findOneAndUpdate({ _id: member.id }, { $set: { kalkmazban: true, reason: reason, cno: a } }, { upsert: true })
        message.react(client.emoji("okey")).catch(() => { });
        let chatembed = new MessageEmbed().setColor("#ff0000")

        await client.channel("bannedLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucudan yasaklandı! \n\` • \`  Yasaklıyan: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Yasaklanma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
        await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından yasaklandın! \`${a}\``).catch(() => { })
        await message.guild.members.ban(`${member.id}`, { reason: `[YARGI] ${message.author.tag}: ${reason}` }).catch(() => { })

    }

}
exports.conf = {
    command: "yargı",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["yargi"],
    timeout: "7000",
    guildTemple: true
}