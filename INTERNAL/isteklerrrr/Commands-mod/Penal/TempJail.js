const ms = require("ms")
const moment = require("moment")
moment.locale("tr")
const Sicil = require("../../Datebase/Moderasyon/Sicil")
const { MessageEmbed } = require("discord.js")
const Cezalar = require("../../Datebase/Moderasyon/Cezalar")
const TempJail = require("../../Datebase/Moderasyon/TempJail")
const Jail = require("../../Datebase/Moderasyon/KalkmazJail")

module.exports.execute = async (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.react(client.emoji("red")).catch(() => { })
    let reason = args.slice(2).join(' ') || "Belirtilmedi"
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(client.emoji("red")).catch(() => { })
    if (message.guild.me.roles.highest.position <= member.roles.highest.position || member.hasPermission("ADMINISTRATOR")) return message.react(client.emoji("red")).catch(() => { })
    if (message.author.id == member.id) return message.react(client.emoji("red")).catch(() => { })
    let time = args[1];
    if (!time) return message.react(client.emoji("red")).catch(() => { })
    if (!member.roles.cache.get(client.role("regWoMans")) && !member.roles.cache.get(client.role("regMans")) && !member.roles.cache.get(client.role("regUnreg"))) return message.react(client.emoji("red")).catch(() => { })
    let bittik = moment(Date.now()).format("LLL")
    let cezabitis = moment(Date.now() + ms(time)).format("LLL")

    let a = client.randomCeza()
    let chatembed = new MessageEmbed().setColor("#ff0000")


    if (member.roles.cache.has(client.role("regWoMans"))) {
        await TempJail.findOneAndUpdate({ _id: member.id }, { $set: { type: "Temp Jail", enabled: true, reason: reason, time: Date.now() + ms(time), cno: a, sex: "Female" } }, { upsert: true })
        await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Temp Jail", auth: message.author.id, basla: Date.now(), bitis: Date.now() + ms(time), reason: reason }, { upsert: true })

        member.roles.remove(client.role("regWoMans")).catch(() => { })
        member.roles.add(client.role("jailed")).catch(() => { })
        await client.channel("jailLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucuda süreli cezalandırıldı! \n\` • \`  Cezalandıran Yetkili: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
        await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından cezalandırıldın! \`${a}\``).catch(() => { })
        message.react(client.emoji("okey")).catch(() => { })
    } else
        if (member.roles.cache.has(client.role("regMans"))) {
            await TempJail.findOneAndUpdate({ _id: member.id }, { $set: { type: "Temp Jail", enabled: true, reason: reason, time: Date.now() + ms(time), cno: a, sex: "Male" } }, { upsert: true })
            await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Temp Jail", auth: message.author.id, basla: Date.now(), bitis: Date.now() + ms(time), reason: reason }, { upsert: true })

            member.roles.remove(client.role("regMans")).catch(() => { })
            member.roles.add(client.role("jailed")).catch(() => { })
            await client.channel("jailLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucuda süreli cezalandırıldı! \n\` • \`  Cezalandıran Yetkili: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
            await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından cezalandırıldın! \`${a}\``).catch(() => { })
            message.react(client.emoji("okey")).catch(() => { })

        } else
            if (member.roles.cache.has(client.role("regUnreg"))) {
                await TempJail.findOneAndUpdate({ _id: member.id }, { $set: { type: "Temp Jail", enabled: true, reason: reason, time: Date.now() + ms(time), cno: a, sex: "Unregister" } }, { upsert: true })
                await Sicil.findOneAndUpdate({ cno: a }, { member: member.id, type: "Temp Jail", auth: message.author.id, basla: Date.now(), bitis: Date.now() + ms(time), reason: reason }, { upsert: true })

                member.roles.remove(client.role("regUnreg")).catch(() => { })
                member.roles.add(client.role("jailed")).catch(() => { })
                await client.channel("jailLOG").send(chatembed.setDescription(`**${member.user.tag}** (\`${member.id}\`) adlı kullanıcısı sunucuda süreli cezalandırıldı! \n\` • \`  Cezalandıran Yetkili: ${message.member} (\`${message.member.id}\`)
        \` • \` Sebep: \`${reason}\`
        \` • \` Cezalandırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setFooter(`Ceza Numarası: ${a}`)).catch(() => { })
                await member.send(`**${message.guild.name}** sunucusundan \`${reason}\` sebebiyle ${message.member} (\`${message.member.id}\`) tarafından cezalandırıldın! \`${a}\``).catch(() => { })
                message.react(client.emoji("okey")).catch(() => { })

            }



    // _id: String,
    // type: String,
    // enabled: Boolean,
    // reason: String,
    // date: Number,
    // cno: Number,
    // sex: String
}
exports.conf = {
    command: "tjail",
    description: "Sunucunun tag sembolunu mesaj kanalına yollar.",
    aliases: ["tempjail"],
    timeout: "7000",
    cmdPerms: ["cmdTekHac","cmdCiftHac", "cdmCeo", "cmdOwner","cmdJail"]
}


// _id: String,
// chatmute: Boolean,
// reason: String,
// date: Number

// _id: String,
// cno: Number,
// sicil: Array
